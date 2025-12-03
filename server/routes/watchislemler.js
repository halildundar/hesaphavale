import {CRUD} from "../db.js";
import {fromEvent} from "rxjs";
export const VerCekIzle = async (req,res) => {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache,no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Content-Encoding", "identity");
  res.setHeader("X-Accel-Buffering", "no");
  // res.setHeader('Access-Control-Allow-Origin','*');
  res.flushHeaders();
  res.write("event: ping\n");
  res.write("data: start\n\n");
  res.flush();

  const collection = CRUD("hesaphavale", "watchislemler");
  const changeStream = collection.watch();
  const changes$ = fromEvent(changeStream, "change");
  const subscription = changes$.subscribe((change) => {
    const type = change.operationType;
    const data = change.fullDocument || change.documentKey;
    res.write(`data: ${JSON.stringify({ type, data: data })}\n\n`);
    res.flush();
  });
  // Cloudflare timeout için ping
  const ping = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
    res.flush();
  }, 15000);
  req.on("close", () => {
    subscription.unsubscribe();
    clearInterval(ping);
    console.log("❌ SSE client disconnected");
  });
};
