import { Router } from "express";
import { CRUD, ObjectID } from "../db.js";
import { fromEvent } from "rxjs";
import { HandlebarsScript, RxjsScript } from "../genel/consts.js";
export const TartiKullaniciRoutes = (app) => {
  app.use("/ctrlpanel/tartikullanici", new TartiKullaniciRouter().router);
  return app.use("/", Router({ mergeParams: true }));
};
 class TartiKullaniciRouter {
  constructor() {
    this.db = CRUD("ctrlyms", "tarti-kullanicilar");
    this.router = Router({ mergeParams: true });
    this.router.get("", this.tartiKullanicilarPage.bind(this));
    this.router.get(
      "/list",
      this.tartiKullanicilarList.bind(this)
    );
    this.router.get(
      "/listname",
      this.tartiKullanicilarListName.bind(this)
    );
    this.router.get(
      "/sse",
      this.tartiKullanicilarWatch.bind(this)
    );
    this.router.post(
      "/add",
      this.tartiKullanicilarCreate.bind(this)
    );
    this.router.post(
      "/update",
      this.tartiKullanicilarUpdate.bind(this)
    );
    this.router.post(
      "/replace",
      this.tartiKullanicilarReplace.bind(this)
    );
    this.router.post(
      "/delete",
      this.tartiKullanicilarDelete.bind(this)
    );
  }

   tartiKullanicilarPage(req, res) {
    return res.render("pages/ctrlpanel/ymsfirma/tartikullanici.hbs", {
      title: "Personeller",
      scriptname: process.env.WEBSCRIPTNAME,
      scripts: HandlebarsScript + RxjsScript,
      layout: "ctrlpanel",
    });
  }
  async tartiKullanicilarListName(req, res) {
    const tartiKullanicilarByName = await this.db.find({$or:[{kisa_ad:{$exists:true}},{ad_soyad:{$exists:true}}]},{kisa_ad:1,ad_soyad:1});
    return res.json(tartiKullanicilarByName);
  }
  async tartiKullanicilarList(req, res) {
    const tartiKullanicilar = await this.db.find({});
    return res.json(tartiKullanicilar);
  }
  async tartiKullanicilarCreate(req, res) {
    const ymsfirma = await this.db.insertOne(req.body);
    return res.json(ymsfirma);
  }
  async tartiKullanicilarUpdate(req, res) {
    const { _id, ...others } = req.body;
    let result = await this.db.updateOne(
      { _id: ObjectID(_id) },
      { $set: others }
    );
    return res.json(result);
  }
  async tartiKullanicilarReplace(req, res) {
    const { _id, ...others } = req.body;
    let result = await this.db.replaceOne(
      { _id: ObjectID(_id)},
      { ...others}
    );
    return res.json(result);
  }
  async tartiKullanicilarDelete(req, res) {
    const { _id } = req.body;
    const deletedYmsFirma = await this.db.deleteOne({
      _id: ObjectID(_id),
    });
    return res.json(deletedYmsFirma);
  }
  async tartiKullanicilarWatch(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Content-Encoding", "none");
    const changeStream = this.db.watch();
    const changes$ = fromEvent(changeStream, "change");
    const subscription = changes$.subscribe((change) => {
      const type = change.operationType;
      const data = change.fullDocument || change.documentKey;
      res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
      // return res.end();
    });

    req.on("close", () => {
      console.log("❌ İstemci bağlantıyı kapattı");
      subscription.unsubscribe();
      changeStream.close();
    });
  }
}
