import { Router } from "express";
import { CRUD, ObjectID } from "./db.js";
import { fromEvent } from "rxjs";
import { HandlebarsScript, RxjsScript } from "./genel/consts.js";
import { readFile } from "node:fs/promises";
import { DashboardPage } from "./routes/dashboard.js";
import { GetKasalar, KasalarPage } from "./routes/kasalar.js";
import {
  IslemlerPage,
  GetIslemlerWatch,
  GetIslemlerList,
} from "./routes/islemler.js";
export const MainRoutes = (app) => {
  app.use("/kasalar", KasalarPage);
  app.use("/api/get-total", GetKasalar);
  app.use("/islemler", IslemlerPage);
  app.use("/api/get-islemler-list", GetIslemlerList);
  app.use("/api/get-islemler-watch", GetIslemlerWatch);
  app.use("/", DashboardPage);
  return app.use("/", Router({ mergeParams: true }));
};

class NotFoundRouter {
  constructor() {
    this.router = Router({ mergeParams: true });
    this.router.all("**", this.Send404Page.bind(this));
  }
  Send404Page(req, res) {
    res.status(404).render("pages/404.hbs", {
      title: "Kontrol Panel",
      scriptname: process.env.WEBSCRIPTNAME,
      scripts: HandlebarsScript + RxjsScript,
    });
  }
}
