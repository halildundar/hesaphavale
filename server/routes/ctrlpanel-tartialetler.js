import { Router } from "express";
import { CRUD, ObjectID } from "../db.js";
import { fromEvent } from "rxjs";
import { HandlebarsScript, RxjsScript } from "../genel/consts.js";
export const TartiAletlerRoutes = (app) => {
  app.use("/ctrlpanel/tartialetler", new TartiAletlerRouter().router);
  return app.use("/", Router({ mergeParams: true }));
};
class TartiAletlerRouter {
  constructor() {
    this.db = CRUD("ctrlyms", "tarti-aletler");
     this.tartikullanicidb = CRUD("ctrlyms", "tarti-kullanicilar");
    this.router = Router({ mergeParams: true });
    this.router.get("/", this.tartiAletlerPage.bind(this));
    this.router.get("/list", this.tartiAletlerList.bind(this));
    this.router.get("/sse", this.tartiAletlerWatch.bind(this));
    this.router.post("/add", this.tartiAletlerCreate.bind(this));
    this.router.post("/update", this.tartiAletlerUpdate.bind(this));
    this.router.post("/replace", this.tartiAletlerReplace.bind(this));
    this.router.post("/delete", this.tartiAletlerDelete.bind(this));
    this.router.get("/listagg", this.tartiAletlerListAgg.bind(this));
  }

  tartiAletlerPage(req, res) {
    return res.render("pages/ctrlpanel/ymsfirma/tartialetleri.hbs", {
      title: "Tartı Aletleri",
      scriptname: process.env.WEBSCRIPTNAME,
      scripts: HandlebarsScript + RxjsScript,
      layout: "ctrlpanel",
    });
  }
  async tartiAletlerList(req, res) {
    console.log("list");
    const tartiAletler = await this.db.find({});
    return res.json(tartiAletler);
  }
  async tartiAletlerListAgg(req, res) {
    console.log("listagg");
    const tartiAletler = await this.db.aggregate(
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
    console.log(tartiAletler);
    return res.json(tartiAletler);
  }
  async tartiAletlerCreate(req, res) {
    const { tar_kul_id, ...others } = req.body;
    const tartialet = await this.db.insertOne({
      tar_kul_id: ObjectID(tar_kul_id),
      ...others,
    });
    return res.json(tartialet);
  }
  async tartiAletlerUpdate(req, res) {
    const { _id, tar_kul_id, ...others } = req.body;
    let result = await this.db.updateOne(
      { _id: ObjectID(_id) },
      { $set: { tar_kul_id: ObjectID(tar_kul_id), ...others } }
    );
    return res.json(result);
  }
  async tartiAletlerReplace(req, res) {
    const { _id, tar_kul_id, ...others } = req.body;
    let result = await this.db.replaceOne(
      { _id: ObjectID(_id) },
      { tar_kul_id: ObjectID(tar_kul_id), ...others }
    );
    return res.json(result);
  }
  async tartiAletlerDelete(req, res) {
    const { _id } = req.body;
    const deletedYmsFirma = await this.db.deleteOne({
      _id: ObjectID(_id),
    });
    return res.json(deletedYmsFirma);
  }
  async tartiAletlerWatch(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Content-Encoding", "none");
    const changeStream = this.db.watch();
    const changes$ = fromEvent(changeStream, "change");
    const subscription = changes$.subscribe(async (change) => {
      const type = change.operationType;
      const data = change.fullDocument || change.documentKey;
      let tartikullanici;
      if (type !== "delete") {
        let filter = { _id:data.tar_kul_id };
        tartikullanici = await this.tartikullanicidb.findOne(filter);
      }
      res.write(`data: ${JSON.stringify({ type, data, tartikullanici })}\n\n`);
    });

    req.on("close", () => {
      console.log("❌ İstemci bağlantıyı kapattı");
      subscription.unsubscribe();
      changeStream.close();
    });
  }
}
