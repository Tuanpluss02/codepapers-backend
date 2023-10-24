const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require("swagger-jsdoc");
const authRouter = require('./app/routes/auth.route');
const swaggerFile = require('./swagger_output.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());


app.use('/auth', authRouter,

);

app.listen(3000, () => {
    console.log("✨ Server is listening on port 3000. Go to http://localhost:3000/docs to see API document");
});
