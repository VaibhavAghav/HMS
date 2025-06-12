const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // your mysql username
  password: "Pass@123", // your mysql password
  database: "hms", 

});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL Database!");
});

module.exports = connection;
