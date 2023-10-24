const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");
const authRouter = require("./app/routes/auth.route");
const swaggerFile = require("./swagger_output.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const path = require("path");
const rootDir = require("./app/utils/path");
const multer = require("multer");
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
app.use(
  multer({ storage: diskStorage, fileFilter: fileFilter }).single("avatar")
);
app.use(
  "/avatar",
  express.static(path.join(rootDir, "app", "public", "avatar"))
);

app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log(
    "✨ Server is listening on port 3000. Go to http://localhost:3000/docs to see API document"
  );
});
