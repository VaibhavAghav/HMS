// doctorModel.js

const db = require("../config/db");

// Check if user is doctor
exports.DoctorLogin = (username, password, callback) => {
  const query = `
    SELECT d.*
    FROM users u
    JOIN doctor d ON u.user_id = d.user_id
    WHERE u.username = ? AND u.password = ?
  `;

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error checking doctor login", err);
      return callback(err, null);
    }
    if (result.length > 0) {
      // doctor found
      return callback(null, result[0]);
    } else {
      // no matching doctor
      return callback(null, null);
    }
  });
};

// Get all doctors
exports.getAllDoctors = (callback) => {
  const query = `
    SELECT d.*, u.username
    FROM doctor d
    JOIN users u ON d.user_id = u.user_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return callback(err, null);
    }
    console.log("Doctors fetched successfully.");
    callback(null, results);
  });
};

// Get all distinct specializations
exports.getAllSpecializations = (callback) => {
  const query = "SELECT DISTINCT spelization FROM doctor";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Get doctors by specialization
exports.getDoctorsBySpecialization = (specialization, callback) => {
  const query = "SELECT * FROM doctor WHERE spelization = ?";
  db.query(query, [specialization], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

exports.getDoctorById = (doctorId, callback) => {
  const query = `
    SELECT d.*, u.username
    FROM doctor d
    JOIN users u ON d.user_id = u.user_id
    WHERE d.doctor_id = ?
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) return callback(err, null);
    if (results.length > 0) {
      callback(null, results[0]);
    } else {
      callback(null, null);
    }
  });
};

exports.getNotVistedPatientsByDoctorId = (doctorId, callback) => {
  const query = `
    SELECT *
    FROM patient
    WHERE doctor_id = ? AND status = 'Not Visited'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

//getVisitedPatientsByDoctorId
exports.getVisitedPatientsByDoctorId = (doctorId, callback) => {
  const query = `
    SELECT *
    FROM patient
    WHERE doctor_id = ? AND status = 'Visited'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

//getAdmitedPatientsByDoctorId
exports.getAdmitedPatientsByDoctorId = (doctorId, callback) => {
  const query = `
    SELECT *
    FROM patient
    WHERE doctor_id = ? AND status = 'Admitted'
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};