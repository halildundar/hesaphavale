import { readFile} from "node:fs/promises";
import express from "express";

async function getIller() {
  let iller = await readFile("./server/genel/adres/il.json", {
    encoding: "utf-8",
  });
  return JSON.parse(iller);
}
async function getIlceler(il) {
  let ilceler = await readFile(`./server/genel/adres/ilce/${il}.json`, {
    encoding: "utf-8",
  });
  return JSON.parse(ilceler);
}
async function getMahalleler(il, ilce) {
  let mahalleler = await readFile(
    `./server/genel/adres/mahalle/${il}_${ilce}.json`,
    { encoding: "utf-8" }
  );
  return JSON.parse(mahalleler);
}
export const AdresRoute = (app, rootpath) => {
  let router = express.Router({ mergeParams: true });
  router.post("/", async (req, res) => {
    let iller = [];
    let ilceler = [];
    let mahalleler = [];
    const { il, ilce, mahalle } = req.body;
    iller = await getIller();
    let selected = {
      il: il,
      ilce: ilce,
      mahalle: mahalle,
      pk: "",
    };
    if (!!il && !!ilce) {
      ilceler = await getIlceler(il);
      mahalleler = await getMahalleler(il, ilce);
      selected.ilce = ilce;
      if (!selected.mahalle) {
        selected.mahalle = mahalleler[0].mahalle;
        selected.pk = mahalleler[0].pk;
      } else {
        let finded = mahalleler.find((a) => a.mahalle == selected.mahalle);
        selected.pk = finded.pk;
      }
    } else if (!!il && !ilce) {
      ilceler = await getIlceler(il);
      mahalleler = await getMahalleler(il, ilceler[0].ilce);
      selected.ilce = ilceler[0].ilce;
      selected.mahalle = mahalleler[0].mahalle;
      selected.pk = mahalleler[0].pk;
    } else {
      ilceler = await getIlceler("ADANA");
      mahalleler = await getMahalleler("ADANA", "ALADAĞ");
      selected.il = "ADANA";
      selected.ilce = ilceler[0].ilce;
      selected.mahalle = mahalleler[0].mahalle;
      selected.pk = mahalleler[0].pk;
    }
    return res.json({
      selected,
      mahalleler,
      ilceler,
      iller,
    });
  });
  
  app.use(rootpath, router);
};
