const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const diskStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "app/public/avatar");
  },
  filename(req, file, callback) {
    const user_id = uuidv4();
    const ext = path.extname(file.originalname);
    req.body.user_id = user_id;
    callback(null, `${user_id}${ext}`);
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
