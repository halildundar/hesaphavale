import express from "express";
import { readFileSync } from "node:fs";
// import { ArtiDoksanCertDB } from "./mysql.js";
export const TemplateRoute = (app,rootpath) => {
  let tempRoute = express.Router({ mergeParams: true });
  tempRoute.post("/get-txt", (req, res) => {
    if (!req.body) {
      return res.json({ msg: "Error!" });
    }
    const { filepath } = req.body;
    res.setHeader("Content-Type", "text/plain");
    const tempHtml = readFileSync(
      `${process.cwd()}/views/temps/${filepath}`,
      "utf-8"
    );
    return res.send(tempHtml);
  });
  app.use(rootpath, tempRoute);
};
