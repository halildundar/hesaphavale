import express from "express";
export let SettingsRoute = (app, db, rootpath) => {
  let router = express.Router({ mergeParams: true });
  // INSERT
  router.post("/", (req, res) => {
    db.create("settings", req.body).subscribe({
      next: (id) => res.json({ id }),
      error: (err) => res.status(500).json({ error: err.message }),
    });
  });

  // READ
  router.get("/", (req, res) => {
    db.read("settings").subscribe({
      next: (setting) => {
        return res.json(setting);
      },
      error: (err) => res.status(500).json({ error: err.message }),
    });
  });

  // UPDATE
  router.put("/:id", (req, res) => {
    db.update("settings", req.body, { id: req.params.id }).subscribe({
      next: (result) => res.json({ updated: result.affectedRows }),
      error: (err) => res.status(500).json({ error: err.message }),
    });
  });
  // DELETE
  router.delete("/:id", (req, res) => {
    db.delete("settings", { id: req.params.id }).subscribe({
      next: (result) => res.json({ deleted: result.affectedRows }),
      error: (err) => res.status(500).json({ error: err.message }),
    });
  });

  // CIHAZ MARKALAR
  //READ QUERY SEARCH
  router.get(`/cihazmarkalar`, (req, res) => {
    db.readTartiAletMarka("tartialetler",req.query.search).subscribe({
      next: (markalar) => {
        console.log(markalar);
        return res.json(markalar);
      },
      error: (err) => res.status(500).json({ error: err.message }),
    });
  });
  // INSERT
  router.post("/cihazmarkalar", (req, res) => {
    db.create("cihazmarkalar", req.body).subscribe({
      next: (id) => res.json({ id }),
      error: (err) => res.status(500).json({ error: err.message }),
    });
  });
 
  app.use(rootpath, router);
};
