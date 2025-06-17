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

exports.getPatientBillsByPatientId = (patientId, callback) => {
  const query = `
    SELECT
  p.patient_id, p.patient_name, p.patient_age, p.patient_gender,
  p.patient_disease, p.time_allocate, p.discharge_date, p.status,
  d.doctor_name,
  b.bill_id, b.bill_date,
  m.medicine_name, m.price_medicine, b.quantity,
  (m.price_medicine * b.quantity) AS total_price,
  r.room_no, r.room_price,
  GREATEST(1, TIMESTAMPDIFF(DAY, p.time_allocate, IFNULL(p.discharge_date, NOW()))) AS days_stayed
FROM patient p
LEFT JOIN doctor d ON p.doctor_id = d.doctor_id
LEFT JOIN bill b ON p.patient_id = b.patient_id
LEFT JOIN medical m ON b.medical_id = m.medical_id
LEFT JOIN room r ON p.room_id = r.room_no
WHERE p.patient_id = ?
ORDER BY b.bill_date DESC

  `;

  db.query(query, [patientId], (err, result) => {
    if (err) {
      console.error("Error fetching patient full bill details by ID:", err);
      return callback(err, null);
    }
    if (result.length > 0) {
      console.log("Patient full bill details fetched successfully:", result);
      return callback(null, result);
    } else {
      return callback(null, null);
    }
  });
};

// Update Patient Status, Discharge Date and Discharge Status
exports.updatePatientStatus = (patientId, status, dischargeDate, callback) => {
  const query = `
    UPDATE patient 
    SET status = ?, discharge_date = ?, discharge_status = 'Discharged' 
    WHERE patient_id = ?
  `;

  db.query(query, [status, dischargeDate, patientId], (err, result) => {
    if (err) {
      console.error("Error updating patient status:", err);
      return callback(err, null);
    }
    if (result.affectedRows > 0) {
      return callback(null, result);
    } else {
      return callback(null, null);
    }
  });
};
