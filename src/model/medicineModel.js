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

exports.getAll = (callback) => {
    const getQuery = "Select *from medical"

    db.query(getQuery, [], (err, result) => {

        if (err) {
            return callback(err, null)
        }
        return callback(null, result);
    });
};

exports.getMedicine = (medicine_id, callback) => {
    const selectQuery = "select * from medical where medical_id = ?"

    db.query(selectQuery, [medicine_id], (err, result) => {
        if (err) {
            return callback(err, null)
        }
        return callback(null, result);
    })
}

exports.updateMedicine = (id, name, price, callback) => {
    const updateQuery = "UPDATE medical SET medicine_name = ?, price_medicine = ? WHERE medical_id = ?";
    db.query(updateQuery, [name, price, id], (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};

// In medicineModel.js
exports.deleteMedicine = (id, callback) => {
    const deleteQuery = "DELETE FROM medical WHERE medical_id = ?";
    db.query(deleteQuery, [id], (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};

