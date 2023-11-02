const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const rootDir = require("./app/utils/path");
const multer = require("multer");
const authRouter = require("./app/routes/auth.route");
const postRouter = require("./app/routes/post.route");
const commentRouter = require("./app/routes/comment.route");
const { diskStorage, fileFilter } = require("./app/utils/multerConfig");

const swaggerFile = require("./swagger_output.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors());

app.use(express.static(path.join(rootDir, "app", "public")));

app.use(
  multer({ storage: diskStorage, fileFilter: fileFilter }).single("avatar")
);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.listen(3000, () => {
  console.log(
    "✨ Server is listening on port 3000. Go to http://localhost:3000/docs to see API document"
  );
});
