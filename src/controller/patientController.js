//patientController.js
const Patient = require('../model/patientModel');

exports.addPatientPage = (req, res) => {
  console.log("Add Patient Page Accessed");
  res.render("Patient/addPatient");
};

exports.viewAllPatients = (req, res) => {
  Patient.getAllPatients((err, patients) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res.status(500).send("Server error");
    }
    res.render("Patient/viewPatients", { patients });
  });
};
