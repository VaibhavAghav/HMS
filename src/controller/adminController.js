const adminModel = require("../model/adminModel");

// Add doctor controller
exports.addDoctor = (req, res) => {
  const doctorData = {
    doctor_id: req.body.doctor_id,
    doctor_name: req.body.doctor_name,
    doctor_contact: req.body.doctor_contact,
    doctor_experience: req.body.doctor_experience,
    status: req.body.status,
    username: req.body.username,
    password: req.body.password,
    admin_id: req.body.admin_id,
  };
  console.log(doctorData);

  adminModel.addDoctor(doctorData, (err, result) => {
    if (err) {
      console.error("Error adding doctor:", err);
      res.status(500).send("Failed to add doctor");
      return;
    }
    res.send("Doctor added successfully!");
  });
};
