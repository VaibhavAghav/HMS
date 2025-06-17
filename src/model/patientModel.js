// patientModel.js

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
  patientData.room_id === "" ? null : patientData.room_id,
  patientData.nurse_id === "" ? null : patientData.nurse_id,
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

exports.getTodayLastAppointmentTime = (doctorId, callback) => {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0]; // 'YYYY-MM-DD'

  const sql = `
    SELECT time_allocate 
    FROM patient 
    WHERE doctor_id = ? AND DATE(time_allocate) = ?
    ORDER BY time_allocate DESC 
    LIMIT 1`;

  db.query(sql, [doctorId, dateString], (err, results) => {
    if (err) {
      console.error("Error fetching today's last appointment time:", err);
      return callback(err, null);
    }
    callback(null, results[0]);
  });
};

exports.getLastAppointmentTime = (doctorId, callback) => {
  const sql = `
    SELECT time_allocate 
    FROM patient 
    WHERE doctor_id = ? 
    ORDER BY time_allocate DESC 
    LIMIT 1`;

  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching last appointment time:", err);
      return callback(err, null);
    }
    callback(null, results[0]);
  });
};

// Get last appointment for doctor today
exports.getLastAppointmentTimeForToday = (doctorId, today, callback) => {
  const sql = `
    SELECT time_allocate 
    FROM patient 
    WHERE doctor_id = ? 
      AND DATE(time_allocate) = ? 
    ORDER BY time_allocate DESC 
    LIMIT 1`;

  db.query(sql, [doctorId, today], (err, results) => {
    if (err) {
      console.error("Error fetching last appointment time:", err);
      return callback(err, null);
    }
    callback(null, results[0]);
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
};

// getBilledPatients all pateint with status 'billed'
exports.getBilledPatients = (callback) => {
  const sql = `SELECT p.*, d.doctor_name, r.room_type, n.nurse_name 
               FROM patient p 
               JOIN doctor d ON p.doctor_id = d.doctor_id 
               JOIN room r ON p.room_id = r.room_no 
               JOIN nurse n ON p.nurse_id = n.nurse_id 
               WHERE p.status = 'Billed'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching billed patients:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

//getUnbilledPatients
exports.getUnbilledPatients = (callback) => {
  const sql = `SELECT p.*, d.doctor_name, r.room_type, n.nurse_name 
               FROM patient p 
               JOIN doctor d ON p.doctor_id = d.doctor_id 
               JOIN room r ON p.room_id = r.room_no 
               JOIN nurse n ON p.nurse_id = n.nurse_id 
               WHERE p.status = 'Visited'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching unbilled patients:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};
