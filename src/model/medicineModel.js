//medicineModel.js
const db = require("../config/db");

exports.saveMedicine = (medicine_name, price_medicine, callback) => {
    const insertQuery = `
        INSERT INTO medical (medicine_name, price_medicine)
        VALUES (?, ?)
    `;

    db.query(insertQuery, [medicine_name, price_medicine], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, result);
    });
};