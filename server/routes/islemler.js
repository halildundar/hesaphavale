import { CRUD, ObjectID } from "../db.js";
import { combineLatest, fromEvent, switchMap, of } from "rxjs";
import { HandlebarsScript, RxjsScript,XLSXScript } from "../genel/consts.js";
import { MongoWatchService } from "../db.js";
import { getDateRange } from "../genel/timeIslemler.js";
export const IslemlerPage = (req, res) => {
  return res.render("pages/islemler.hbs", {
    title: "İşlemler | Hesap Havale",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: HandlebarsScript + RxjsScript + XLSXScript,
    route: "/islemler"
  });
};
export const GetIslemlerList = async (req, res) => {
  let db = CRUD("hesaphavale", "islemler");
  let rangeType = req.query.range || "yesterday";
  let endDate = req.query.isendtime;
  if (!rangeType) return res.status(400).send("Missing range param");

  const range = getDateRange(rangeType, "Europe/Istanbul");
  let filter = {
    $gte: range.trStartNoOffset,
  };
  if (!!endDate) {
    filter["$lte"] = range.trEndNoOffset;
  }
  const datas = await db.find({
    activityDateTime: filter,
  },{},{activityDateTime:-1});
  return res.json(datas);
};

export const GetIslemlerWatch = (req, res) => {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache,no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Encoding", "identity");
  res.setHeader('X-Accel-Buffering', 'no');
  // res.setHeader('Access-Control-Allow-Origin','*');
  res.flushHeaders(); 
  res.write("event: ping\ndata: start\n\n");
  res.flush();
  let rangeType = req.query.range || "today";
  let endDate = req.query.isendtime;
  if (!rangeType) return res.status(400).send("Missing range param");

  const mongoWatch = new MongoWatchService("islemler");
  // Başlangıç: yesterday
  // console.log(rangeType);
  mongoWatch.setFilterByDateRange(rangeType, endDate);
  const subscription = mongoWatch.watch().subscribe((change) => {
    const type = change.operationType;
    const data = change.fullDocument || change.documentKey;
    console.log("operationType",change.operationType);
    res.write(`data: ${JSON.stringify({ type, data})}\n\n`);
    res.flush();
  });
  // Cloudflare timeout için ping
  const ping = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: new Date()})}\n\n`);
    res.flush();
  }, 15000);
  // Client disconnect
  req.on("close", () => {
    subscription.unsubscribe();
    clearInterval(ping);
    console.log("❌ SSE client disconnected");
  });
};
