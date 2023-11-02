const multer = require("multer");
const { diskStorage, fileFilter } = require("../utils/multerConfig");

exports.multerProcess = multer({ storage: diskStorage, fileFilter: fileFilter }).single("avatar");