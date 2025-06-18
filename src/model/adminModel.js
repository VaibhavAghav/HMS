const db = require("../config/db");

const bcrypt = require("bcrypt");

// Get patient count
// Get total patient count
exports.getPatientCount = (callback) => {
  const query = "SELECT COUNT(*) AS count FROM patient";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0].count);
  });
};

// Get total doctor count
exports.getDoctorCount = (callback) => {
  const query = "SELECT COUNT(*) AS count FROM doctor";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0].count);
  });
};

// Get count of patients without discharge
exports.getAdmittedPatientCount = (callback) => {
  const query =
    "SELECT COUNT(*) AS count FROM patient WHERE discharge_status IS NULL";
  db.query(query, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0].count);
  });
};

exports.addAdmin = (adminData, callback) => {
  // Generate hashed password first
  const saltRounds = 10;
  bcrypt.hash(adminData.password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      callback(err, null);
      return;
    }

    // Now insert user with hashed password
    const insertUserQuery =
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

    db.query(
      insertUserQuery,
      [adminData.username, hashedPassword, "admin"],
      (err, userResult) => {
        if (err) {
          console.error("Error inserting user:", err);
          callback(err, null);
          return;
        }

        const user_id = userResult.insertId;
        console.log("User inserted with ID:", user_id);

        // Now insert into admin table
        const insertAdminQuery = `
          INSERT INTO admin 
          (admin_contact, admin_email, user_id) 
          VALUES (?, ?, ?)
        `;

        db.query(
          insertAdminQuery,
          [adminData.admin_contact, adminData.admin_email, user_id],
          (err, adminResult) => {
            if (err) {
              console.error("Error inserting admin:", err);
              callback(err, null);
              return;
            }

            callback(null, adminResult);
          }
        );
      }
    );
  });
};

//login admin
exports.loginAdmin = (username, password, callback) => {
  const query = `
    SELECT u.user_id, u.username, u.password, u.role, a.admin_contact, a.admin_email 
    FROM users u 
    JOIN admin a ON u.user_id = a.user_id 
    WHERE u.username = ? AND u.role = 'admin'
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error during admin login:", err);
      callback(err, null);
      return;
    }

    if (results.length === 0) {
      callback(null, null);
    } else {
      const admin = results[0];

      bcrypt.compare(password, admin.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          callback(err, null);
          return;
        }

        if (!isMatch) {
          callback(null, null);
        } else {
          delete admin.password;
          callback(null, admin);
        }
      });
    }
  });
};

// get all doctors
exports.getAllDoctors = (callback) => {
  const query = `
    SELECT d.doctor_id, d.doctor_name, d.doctor_contact, d.doctor_experience, 
           d.status, d.spelization, u.username 
    FROM doctor d 
    JOIN users u ON d.user_id = u.user_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

// get doctor by ID getDoctorById
exports.getDoctorById = (doctorId, callback) => {
  const query = `
    SELECT d.doctor_id, d.doctor_name, d.doctor_contact, d.doctor_experience, 
           d.status, d.spelization, u.username 
    FROM doctor d 
    JOIN users u ON d.user_id = u.user_id 
    WHERE d.doctor_id = ?
  `;

  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error("Error fetching doctor by ID:", err);
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

// update doctor editDoctor
exports.updateDoctor = (doctorId, updatedData, callback) => {
  const updateDoctorQuery = `
    UPDATE doctor
    SET doctor_name = ?, doctor_contact = ?, doctor_experience = ?,
        status = ?, spelization = ?
    WHERE doctor_id = ?
  `;
  db.query(
    updateDoctorQuery,
    [
      updatedData.doctor_name,
      updatedData.doctor_contact,
      updatedData.doctor_experience,
      updatedData.status,
      updatedData.spelization,
      doctorId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating doctor:", err);
        callback(err, null);
        return;
      }
      if (result.affectedRows === 0) {
        callback(new Error("Doctor not found"), null);
      } else {
        callback(null, result);
      }
    }
  );
};
// delete doctor deleteDoctor
exports.deleteDoctor = (doctorId, callback) => {
  const deleteDoctorQuery = `
    DELETE FROM doctor WHERE doctor_id = ?
  `;
  db.query(deleteDoctorQuery, [doctorId], (err, result) => {
    if (err) {
      console.error("Error deleting doctor:", err);
      callback(err, null);
      return;
    }
    if (result.affectedRows === 0) {
      callback(new Error("Doctor not found"), null);
    } else {
      callback(null, result);
    }
  });
};

exports.addDoctor = (doctorData, callback) => {
  // Step 1: Insert into users table
  const insertUserQuery =
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

  db.query(
    insertUserQuery,
    [doctorData.username, doctorData.password, "doctor"],
    (err, userResult) => {
      if (err) {
        console.error("Error inserting user:", err);
        callback(err, null);
        return;
      }

      const user_id = userResult.insertId;
      console.log("User inserted with ID:", user_id);

      // Step 2: Insert into doctor table
      const insertDoctorQuery = `
        INSERT INTO doctor 
        (doctor_name, doctor_contact, doctor_experience, status, spelization, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertDoctorQuery,
        [
          doctorData.doctor_name,
          doctorData.doctor_contact,
          doctorData.doctor_experience,
          doctorData.status,
          doctorData.spelization,
          user_id,
        ],
        (err, doctorResult) => {
          if (err) {
            console.error("Error inserting doctor:", err);
            callback(err, null);
            return;
          }

          callback(null, doctorResult);
        }
      );
    }
  );
};

exports.addReceptionist = (receptionistData, callback) => {
  // Step 1: Insert into users table
  const insertUserQuery =
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

  db.query(
    insertUserQuery,
    [receptionistData.username, receptionistData.password, "receptionist"],
    (err, userResult) => {
      if (err) {
        console.error("Error inserting user:", err);
        callback(err, null);
        return;
      }

      const user_id = userResult.insertId;
      console.log("User inserted with ID:", user_id);

      // Step 2: Insert into reception table
      const insertReceptionQuery = `
        INSERT INTO reception 
        (reception_name, reception_contact, user_id) 
        VALUES (?, ?, ?)
      `;

      db.query(
        insertReceptionQuery,
        [
          receptionistData.reception_name,
          receptionistData.reception_contact,
          user_id,
        ],
        (err, receptionResult) => {
          if (err) {
            console.error("Error inserting receptionist:", err);
            callback(err, null);
            return;
          }

          callback(null, receptionResult);
        }
      );
    }
  );
};

exports.getAllReceptionists = (callback) => {
  const query = "SELECT * FROM reception";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching receptionists:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// get receptionist by ID
exports.getReceptionistById = (receptionistId, callback) => {
  const query = `
    SELECT r.reception_id, r.reception_name, r.reception_contact, u.username 
    FROM reception r 
    JOIN users u ON r.user_id = u.user_id 
    WHERE r.reception_id = ?
  `;

  db.query(query, [receptionistId], (err, results) => {
    if (err) {
      console.error("Error fetching receptionist by ID:", err);
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

// update receptionist
exports.updateReceptionist = (receptionistId, updatedData, callback) => {
  const updateReceptionQuery = `
    UPDATE reception
    SET reception_name = ?, reception_contact = ?
    WHERE reception_id = ?
  `;
  db.query(
    updateReceptionQuery,
    [updatedData.reception_name, updatedData.reception_contact, receptionistId],
    (err, result) => {
      if (err) {
        console.error("Error updating receptionist:", err);
        callback(err, null);
        return;
      }
      if (result.affectedRows === 0) {
        callback(new Error("Receptionist not found"), null);
      } else {
        callback(null, result);
      }
    }
  );
};

// delete receptionist
exports.deleteReceptionist = (receptionistId, callback) => {
  const deleteReceptionQuery = `
    DELETE FROM reception WHERE reception_id = ?
  `;
  db.query(deleteReceptionQuery, [receptionistId], (err, result) => {
    if (err) {
      console.error("Error deleting receptionist:", err);
      callback(err, null);
      return;
    }
    if (result.affectedRows === 0) {
      callback(new Error("Receptionist not found"), null);
    } else {
      callback(null, result);
    }
  });
};
