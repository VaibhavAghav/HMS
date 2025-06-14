const e = require("express");
const db = require("../config/db"); // your DB connection config

exports.addPatient = (patientData, callback) => {
  const sql = `INSERT INTO patient 
  (patient_name, patient_age, patient_gender, doctor_id, patient_disease, room_id, nurse_id, time_allocate, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    patientData.patient_name,
    patientData.patient_age,
    patientData.patient_gender,
    patientData.doctor_id,
    patientData.patient_disease,
    patientData.room_id,
    patientData.nurse_id,
    patientData.time_allocate,
    patientData.status,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding patient:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Get all patients
exports.getAllPatients = (callback) => {
  const sql = `SELECT p.*, d.doctor_name, r.room_type, n.nurse_name 
               FROM patient p 
               JOIN doctor d ON p.doctor_id = d.doctor_id 
               JOIN room r ON p.room_id = r.room_no 
               JOIN nurse n ON p.nurse_id = n.nurse_id`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};


// Get patient by ID
exports.getPatientById = (patientId, callback) => {
  const sql = `SELECT p.*, d.doctor_name, r.room_type, n.nurse_name 
               FROM patient p 
               JOIN doctor d ON p.doctor_id = d.doctor_id 
               JOIN room r ON p.room_id = r.room_no 
               JOIN nurse n ON p.nurse_id = n.nurse_id 
               WHERE p.patient_id = ?`;

  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error("Error fetching patient by ID:", err);
      return callback(err, null);
    }
    callback(null, results[0]);
  });
};


//change patient status updatePatientStatus
exports.updatePatientStatus = (patientId, status, callback) => {
  const sql = `UPDATE patient SET status = ? WHERE patient_id = ?`;
  db.query(sql, [status, patientId], (err, result) => {
    if (err) {
      console.error("Error updating patient status:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
}

