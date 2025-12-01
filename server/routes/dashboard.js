import { CRUD, ObjectID } from "../db.js";
import { combineLatest, fromEvent, switchMap, of } from "rxjs";
import { HandlebarsScript, RxjsScript } from "../genel/consts.js";
export const DashboardPage = (req, res) => {
  return res.render("pages/dashboard.hbs", {
    title: "Dashboard | Hesap Havale",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: HandlebarsScript + RxjsScript,
    route: "/",
  });
};
