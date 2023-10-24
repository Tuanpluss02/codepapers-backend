const db = require("mysql2");
require("dotenv").config();

const conn = db.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
});

conn.connect((err) => {
  if (err) throw err;
  console.log(`✅ Connected to database: ${process.env.DB_NAME}`);
});
module.exports = conn;
