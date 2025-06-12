// nurseModel.js

const db = require("../config/db");


exports.addNurse = (nurseData, callback) => {
  const { nurse_name, nurse_contact, nurse_shift } = nurseData;

  const sql = "INSERT INTO nurse (nurse_name, nurse_contact, nurse_shift) VALUES (?, ?, ?)";

  db.query(sql, [nurse_name, nurse_contact, nurse_shift], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Fetch all nurses
exports.getAllNurses = (callback) => {
  const sql = "SELECT * FROM nurse";

  db.query(sql, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Fetch a nurse by ID
exports.getNurseById = (nurseId, callback) => {
  const sql = "SELECT * FROM nurse WHERE nurse_id = ?";

  db.query(sql, [nurseId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null); // No nurse found
    }
    callback(null, results[0]);
  });
};

// Update a nurse by ID
exports.updateNurse = (nurseId, updatedData, callback) => {
  const { nurse_name, nurse_contact, nurse_shift } = updatedData;

  const sql = "UPDATE nurse SET nurse_name = ?, nurse_contact = ?, nurse_shift = ? WHERE nurse_id = ?";

  db.query(sql, [nurse_name, nurse_contact, nurse_shift, nurseId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Delete a nurse by ID
exports.deleteNurse = (nurseId, callback) => {
  const sql = "DELETE FROM nurse WHERE nurse_id = ?";

  db.query(sql, [nurseId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};
