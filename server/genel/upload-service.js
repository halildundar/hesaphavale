import multer from "multer";
import express from "express";
import {
  mkdirSync,
  existsSync,
  unlinkSync,
  rmdirSync,
  readdirSync,
  statSync,
} from "fs";
let router = express.Router({ mergeParams: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { dest_path } = req.body;
    let new_path = process.cwd() + "/dist" + dest_path;
    const isExist = existsSync(new_path);
    if (!isExist) {
      mkdirSync(new_path, { recursive: true });
    }
    cb(null, new_path);
  },
  filename: function (req, file, cb) {
    const { filename } = req.body;
    cb(null, filename + "." + file.originalname.split(".").pop());
  },
});
function getFilesizeInBytes(filename) {
  var stats = statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
const upload = multer({ storage: storage });
export const UplaodFileRoute = (app,rootpath) => {
  let router = express.Router({ mergeParams: true });
  router.post("/fileupload", upload.single("file"), (req, res) => {
    res.status(200).json({ msg: "Ok!" });
  });
  router.post("/listfiles", (req, res) => {
    if (!req.body) {
      return res.json({ msg: "Hata!" });
    }
    const { folderpath } = req.body;
    let new_path = process.cwd() + "/dist" + folderpath;
    const isExist = existsSync(new_path);
    if (!isExist) {
      mkdirSync(new_path, { recursive: true });
    }
    const listFolders = readdirSync(new_path, { encoding: "utf-8" });
    const newListFolder = listFolders.map((item) => {
      const filename = item.split("/").pop();
      const newItem = {
        url: folderpath + "/" + item,
        size: getFilesizeInBytes(new_path + "/" + item),
        filename: filename,
      };
      return newItem;
    });
    return res.status(200).json({ files: newListFolder });
  });
  router.post("/filedelete", (req, res) => {
    const data = req.body;
    if (!data) {
      return res.json({ msg: "Data Not found" });
    }
    const { filepath } = req.body;
    let new_path = process.cwd() + "/dist" + filepath;
    const isExist = existsSync(new_path);
    if (isExist) {
      unlinkSync(new_path);
      return res.json({ msg: "Kaldırıldı" });
    }
    return res.json({ msg: "Başarısız" });
  });
  router.post("/folderdelete", (req, res) => {
    const data = req.body;
    if (!data) {
      return res.json({ msg: "Data Not found" });
    }
    const { folderpath } = req.body;
    let new_path = process.cwd() + "/dist" + folderpath;
    const isExist = existsSync(new_path);
    if (isExist) {
      rmdirSync(new_path, { recursive: true });
    }
    return res.json({ msg: "Kaldırıldı" });
  });
  app.use(rootpath, router);
};
