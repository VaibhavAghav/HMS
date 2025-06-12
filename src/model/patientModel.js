const db = require("../config/db"); // your DB connection config

const Patient = {
  getAllPatients: (callback) => {
    const query = `SELECT * FROM patient`;
    db.query(query, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },
};

module.exports = Patient;
