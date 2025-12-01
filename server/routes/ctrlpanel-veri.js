import { Router } from "express";
import { CRUD, ObjectID } from "../db.js";
import { fromEvent } from "rxjs";
import { HandlebarsScript, RxjsScript,XLSXScript } from "../genel/consts.js";
export const VeriRoutes = (app) => {
  app.use("/ctrlpanel/veri", new VeriRouter().router);
  return app.use("/", Router({ mergeParams: true }));
};
 class VeriRouter {
  constructor() {
    // this.db = CRUD("ctrlyms", "personeller");
    this.router = Router({ mergeParams: true });
    this.router.get("/", this.veriPage.bind(this));
    this.router.get(
      "/list",
      this.personelList.bind(this)
    );
    this.router.get(
      "/sse",
      this.personelWatch.bind(this)
    );
    this.router.post(
      "/add",
      this.personelCreate.bind(this)
    );
    this.router.post(
      "/update",
      this.personelUpdate.bind(this)
    );
    this.router.post(
      "/replace",
      this.personelReplace.bind(this)
    );
    this.router.post(
      "/delete",
      this.personelDelete.bind(this)
    );
  }
  // Personeller
  veriPage(req, res) {
    return res.render("pages/ctrlpanel/ymsfirma/veri.hbs", {
      title: "Toplu veri işlemleri",
      scriptname: process.env.WEBSCRIPTNAME,
      scripts: HandlebarsScript + RxjsScript + XLSXScript,
      layout: "ctrlpanel",
    });
  }
  async personelList(req, res) {
    const users = await this.db.find({});
    res.json(users);
  }
  async personelCreate(req, res) {
    const user = await this.db.insertOne(req.body);
    res.json(user);
  }
  async personelUpdate(req, res) {
    const { _id, ...others } = req.body;
    let result = await this.db.updateOne(
      { _id: ObjectID(_id) },
      { $set: others }
    );
    return res.json(result);
  }
  async personelReplace(req, res) {
    const { _id, ...others } = req.body;
    let result = await this.db.replaceOne(
      { _id: ObjectID(_id) },
      others
    );
    return res.json(result);
  }
  async personelDelete(req, res) {
    const { _id } = req.body;
    const deletedYmsFirma = await this.db.deleteOne({
      _id: ObjectID(_id),
    });
    return res.json(deletedYmsFirma);
  }
  async personelWatch(req, res) {
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
    });

    req.on("close", () => {
      console.log("❌ İstemci bağlantıyı kapattı");
      subscription.unsubscribe();
      changeStream.close();
    });
  }
}
