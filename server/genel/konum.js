import express from "express";
export let KonumRoute = (app, db, rootpath) => {
  let router = express.Router({ mergeParams: true });
  router.post("/get-distance", async (req, res) => {
    const { origin, destination } = req.body;
    // origins=${origin}|${origin1}&destinations=${destination}|${destination1} gibi birden fazla da yazılabilir
    try {
      const apiKey = "AIzaSyDtcA5drhZ6_R-dXMfwu6-XQBUnZkTbY3Q"; // kendi Google API key'ini koy
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=driving&key=${apiKey}`;
      const response = await fetch(url);
      res.json(await response.json());
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "API çağrısı başarısız" });
    }
  });

  app.use(rootpath, router);
};
