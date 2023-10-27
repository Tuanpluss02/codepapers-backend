const rootDir = require("./path");
const multer = require("multer");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(rootDir, "app", "public", "avatar"));
  },
  filename(req, file, callback) {
    const date = new Date().toISOString().replace(/:/g, "_").replace(/\./g, "");
    callback(null, `${date}${file.originalname}`);
  },
});
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

module.exports = {
  diskStorage,
  fileFilter,
};
