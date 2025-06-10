const db = require("../config/db");

exports.addDoctor = (doctorData, callback) => {
  // Step 1: Insert into users table
  const insertUserQuery =
    "INSERT INTO users ( user_id , username, password, role) VALUES (?, ?, ?, ?)";

  db.query(
    insertUserQuery,
    [doctorData.doctor_id, doctorData.username, doctorData.password, "doctor"],
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
        (doctor_id, doctor_name, doctor_contact, doctor_experience, status, user_id, admin_id) 
        VALUES (?,?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertDoctorQuery,
        [
          doctorData.doctor_id,
          doctorData.doctor_name,
          doctorData.doctor_contact,
          doctorData.doctor_experience,
          doctorData.status,
          doctorData.doctor_id,
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
