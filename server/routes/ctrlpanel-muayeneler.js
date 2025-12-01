import { Router } from "express";
import { CRUD, ObjectID } from "../db.js";
import { combineLatest, fromEvent, switchMap, of } from "rxjs";
import { HandlebarsScript, RxjsScript } from "../genel/consts.js";
export const MuayenelerRoutes = (app) => {
  app.use("/ctrlpanel/muayeneler", new MuayenelerRouter().router);
  return app.use("/", Router({ mergeParams: true }));
};
class MuayenelerRouter {
  constructor() {
    this.db = CRUD("ctrlyms", "muayeneler");
    this.personeldb = CRUD("ctrlyms", "personeller");
    this.tartikullanicidb = CRUD("ctrlyms", "tarti-kullanicilar");
    this.tartialetlerdb = CRUD("ctrlyms", "tarti-aletler");
    this.router = Router({ mergeParams: true });
    this.router.get("/", this.muayenelerPage.bind(this));
    this.router.get("/list", this.muayenelerList.bind(this));
    this.router.get("/sse", this.muayenelerWatch.bind(this));
    this.router.post("/add", this.muayenelerCreate.bind(this));
    this.router.post("/update", this.muayenelerUpdate.bind(this));
    this.router.post("/replace", this.muayenelerReplace.bind(this));
    this.router.post("/delete", this.muayenelerDelete.bind(this));

    this.router.get("/tartialetler/list", this.tartialetleriList.bind(this));
    this.router.get("/personel/list", this.denetcileriList.bind(this));
  }

  muayenelerPage(req, res) {
    return res.render("pages/ctrlpanel/ymsfirma/muayeneler.hbs", {
      title: "Tartı Aletleri",
      scriptname: process.env.WEBSCRIPTNAME,
      scripts: HandlebarsScript + RxjsScript,
      layout: "ctrlpanel",
    });
  }
  async muayenelerList(req, res) {
    console.log("list");
    // const muayeneler = await this.db.find({});
    // console.log(muayeneler);
    const muayeneler = await this.db.collection
      .aggregate([
        {
          $lookup: {
            from: "tarti-aletler",
            localField: "tar_alet_id",
            foreignField: "_id",
            as: "tartialet",
          },
        },
        {
          $unwind: {
            path: "$tartialet",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "tarti-kullanicilar",
            localField: "tartialet.tar_kul_id",
            foreignField: "_id",
            as: "tartikullanici",
          },
        },
        {
          $unwind: {
            path: "$tartikullanici",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "personeller",
            localField: "pers_id",
            foreignField: "_id",
            as: "personel",
          },
        },
        {
          $unwind: {
            path: "$personel",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    console.log("muayeneler", muayeneler);
    return res.json(muayeneler);
  }
  async muayenelerCreate(req, res) {
    const { pers_id, tar_alet_id, ...others } = req.body;
    const tartialet = await this.db.insertOne({
      pers_id: ObjectID(pers_id),
      tar_alet_id: ObjectID(tar_alet_id),
      ...others,
    });
    return res.json(tartialet);
  }
  async muayenelerUpdate(req, res) {
    const { _id, ...others } = req.body;
    let result = await this.db.updateOne(
      { _id: ObjectID(_id) },
      { $set: others }
    );
    return res.json(result);
  }
  async muayenelerReplace(req, res) {
    const { _id, pers_id, tar_alet_id, ...others } = req.body;
    let result = await this.db.replaceOne(
      { _id: ObjectID(_id) },
      {
        pers_id: ObjectID(pers_id),
        tar_alet_id: ObjectID(tar_alet_id),
        ...others,
      }
    );
    return res.json(result);
  }
  async muayenelerDelete(req, res) {
    const { _id } = req.body;
    console.log(req.body);
    const deletedItem = await this.db.deleteOne({
      _id: ObjectID(_id),
    });
    return res.json(deletedItem);
  }
  async muayenelerWatch(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Content-Encoding", "none");
    const changeStream = this.db.collection.watch([], {
      fullDocument: "updateLookup",
    });
    const changes$ = fromEvent(changeStream, "change");
    const subscription = changes$
      .pipe(
        switchMap((a) => {
          console.log(a);
          let data = of({_id:a.documentKey._id});
          if (a.operationType !== "delete") {
            data = this.db.collection.aggregate([
              {
                $match: { _id: a.fullDocument._id },
              },
              {
                $lookup: {
                  from: "tarti-aletler",
                  localField: "tar_alet_id",
                  foreignField: "_id",
                  as: "tartialet",
                },
              },
              {
                $unwind: {
                  path: "$tartialet",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "tarti-kullanicilar",
                  localField: "tartialet.tar_kul_id",
                  foreignField: "_id",
                  as: "tartikullanici",
                },
              },
              {
                $unwind: {
                  path: "$tartikullanici",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "personeller",
                  localField: "pers_id",
                  foreignField: "_id",
                  as: "personel",
                },
              },
              {
                $unwind: {
                  path: "$personel",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ]);
          }

          return combineLatest({ change: of(a), data: data });
        })
      )
      .subscribe(({ change, data }) => {
        console.log(change, data);
        const type = change.operationType;
        // const data = change.fullDocument || change.documentKey;
        res.write(`data: ${JSON.stringify({ type, data: data })}\n\n`);
        // return res.end();
      });

    req.on("close", () => {
      console.log("❌ İstemci bağlantıyı kapattı");
      subscription.unsubscribe();
      changeStream.close();
    });
  }
  async tartialetleriList(req, res) {
    const tartialetler = await this.tartialetlerdb.aggregate(
      {},
      {
        from: "tarti-kullanicilar",
        localField: "tar_kul_id",
        foreignField: "_id",
        as: "tartikullanici",
      },
      {
        tartikullanici: { $arrayElemAt: ["$tartikullanici", 0] },
      }
    );
    console.log(typeof tartialetler);
    return res.json(tartialetler);
  }
  async denetcileriList(req, res) {
    const denetciler = await this.personeldb.find();
    console.log(typeof denetciler);
    return res.json(denetciler);
  }
}
