//receptionModel.js
const db = require("../config/db");

// Reception Login Check
exports.ReceptionLogin = (username, password, callback) => {
  const query = `
    SELECT r.*, u.username
    FROM users u
    JOIN reception r ON u.user_id = r.user_id
    WHERE u.username = ? AND u.password = ?
  `;

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error checking reception login", err);
      return callback(err, null);
    }
    if (result.length > 0) {
      return callback(null, result[0]);
    } else {
      return callback(null, null);
    }
  });
};

// Get Reception Details by user_id
exports.getReceptionDetailsByUserId = (user_id, callback) => {
  const query = `
    SELECT r.*, u.username
    FROM reception r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("Error fetching reception details", err);
      return callback(err, null);
    }
    if (result.length > 0) {
      return callback(null, result[0]);
    } else {
      return callback(null, null);
    }
  });
};
