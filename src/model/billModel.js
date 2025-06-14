// billModel.ejs

const db = require("../config/db");

// Save multiple bill entries
exports.insertBills = (billEntries, callback) => {
    const insertQuery = `
    INSERT INTO bill (patient_id, medical_id, quantity, bill_date)
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

// Get all bills for a specific patient
exports.getBillsByPatientId = (patientId, callback) => {
    const selectQuery = `
    SELECT b.bill_id, b.bill_date, m.medicine_name AS medicine_name, b.quantity
    FROM bill b
    JOIN medical m ON b.medical_id = m.medical_id
    WHERE b.patient_id = ?
  `;

    db.query(selectQuery, [patientId], (err, results) => {
        if (err) {
            console.error("Error fetching bills:", err);
            return callback(err, null);
        }

        callback(null, results);
    });
};
