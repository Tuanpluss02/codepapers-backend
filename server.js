const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require("swagger-jsdoc");
const authRouter = require('./app/routes/auth.route');
const swaggerFile = require('./swagger_output.json');

// const options = {
//     definition: {
//         openapi: "3.1.0",
//         info: {
//             title: "Codepapers API documents",
//             version: "0.1.0",
//             description:
//                 "This is backend API documents for Codepapers project",
//             license: {
//                 name: "MIT",
//                 url: "https://spdx.org/licenses/MIT.html",
//             },
//             contact: {
//                 name: "Tuan Do",
//                 url: "https://github.com/Tuanpluss02",
//             },
//         },
//         servers: [
//             {
//                 url: "http://localhost:3000",
//             },
//         ],
//     },
//     apis: ["./app/controllers/*.js"],
// };

// const specs = swaggerJsdoc(options);

// app.use(
//     "/docs",
//     swaggerUi.serve,
//     swaggerUi.setup(specs)
// );

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRouter);

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
