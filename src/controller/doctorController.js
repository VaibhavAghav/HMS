//doctorController.js
const adminModel = require("../model/adminModel");

// Controller for admin homepage
exports.DoctorHomePage = (req, res) => {
  console.log("Inside DoctorHomePage controller");
  if (!req.session.user || req.session.user.role !== "doctor") {
    console.log("Unauthorized access or session expired");
    return res.redirect("/login");
  }

  const doctorId = req.session.user.doctor_id;
  console.log("Doctor ID from session:", doctorId);

  res.render("Doctor/doctorHomePage");
};
