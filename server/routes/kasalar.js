import { CRUD, ObjectID } from "../db.js";
import { combineLatest, fromEvent, switchMap, of } from "rxjs";
import { HandlebarsScript,RxjsScript } from "../genel/consts.js";
export const KasalarPage = (req, res) => {
  return res.render("pages/kasalar.hbs", {
    title: "Kasalar | Hesap Havale",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: HandlebarsScript + RxjsScript,
    route:"/kasalar"
  });
};
