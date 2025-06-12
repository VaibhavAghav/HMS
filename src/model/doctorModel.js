// doctorModel.js

const db = require("../config/db");

// Check if user is doctor
exports.DoctorLogin = (username, password, callback) => {
  const query = `
    SELECT d.*
    FROM users u
    JOIN doctor d ON u.user_id = d.user_id
    WHERE u.username = ? AND u.password = ?
  `;

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error checking doctor login", err);
      return callback(err, null);
    }
    if (result.length > 0) {
      // doctor found
      return callback(null, result[0]);
    } else {
      // no matching doctor
      return callback(null, null);
    }
  });
};
