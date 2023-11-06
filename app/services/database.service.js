const db = require("mysql2");
require("dotenv").config();

// connect mysql in digital ocean
const conn = db.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

conn.connect((err) => {
  if (err) {
    console.log("Error connecting to Db");
    return;
  }
  console.log(`✅ Connected to database: ${process.env.DB_NAME}`);
});


module.exports = conn;
