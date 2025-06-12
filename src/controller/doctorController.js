//doctorController.js
const adminModel = require("../model/adminModel");

// Controller for admin homepage
exports.DoctorHomePage = (req, res) => {
  console.log("Inside admin homepage");
  
  res.render("Doctor/doctorHomePage");
};

