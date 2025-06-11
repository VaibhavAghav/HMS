const db = require("../config/db");

const bcrypt = require("bcrypt");

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
        (doctor_name, doctor_contact, doctor_experience, status, spelization, user_id, admin_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
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
          doctorData.admin_id,
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
        (reception_name, reception_contact, user_id, admin_id) 
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertReceptionQuery,
        [
          receptionistData.reception_name,
          receptionistData.reception_contact,
          user_id,
          receptionistData.admin_id,
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
