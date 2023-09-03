const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('./app/routes/auth.route')(app);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
