// billModel.ejs

const db = require("../config/db");

// Save multiple bill entries
exports.insertBills = (billEntries, callback) => {
    const insertQuery = `
    INSERT INTO bill (patient_id, medical_id, quntity, bill_date)
    VALUES ?
  `;

    db.query(insertQuery, [billEntries], (err, result) => {
        if (err) {
            console.error("Error inserting into bill table:", err);
            return callback(err, null);
        }

        callback(null, result);
    });
};
