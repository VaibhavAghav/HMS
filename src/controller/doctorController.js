//doctorController.js
const adminModel = require("../model/adminModel");
const doctorModel = require("../model/doctorModel");

// Controller for admin homepage
exports.DoctorHomePage = (req, res) => {
  console.log("Inside admin homepage");

  console.log("Inside DoctorHomePage controller");
  if (!req.session.user || req.session.user.role !== "doctor") {
    console.log("Unauthorized access or session expired");
    return res.redirect("/login");
  }

  const doctorId = req.session.user.doctor_id;
  console.log("Doctor ID from session:", doctorId);

  //model -> docotor info -> HomePage
  doctorModel.getDoctorById(doctorId, (err, doctorInfo) => {
    if (err) {
      console.log("Error fetching doctor info:", err);
      return res.status(500).send("Internal server error.");
    }

    if (!doctorInfo) {
      return res.status(404).send("Doctor not found");
    }

    // ✅ Pass doctorInfo to the view
    console.log(doctorInfo);

    res.render("Doctor/doctorHomePage", { doctor: doctorInfo });
  });
};

// Controller for viewing patients
exports.viewPatients = (req, res) => {
  console.log("Inside viewPatients controller");

  if (!req.session.user || req.session.user.role !== "doctor") {
    console.log("Unauthorized access or session expired");
    return res.redirect("/login");
  }

  const doctorId = req.session.user.doctor_id;
  console.log("Doctor ID from session:", doctorId);

  // Fetch patients assigned to the doctor
  doctorModel.getPatientsByDoctorId(doctorId, (err, patients) => {
    if (err) {
      console.log("Error fetching patients:", err);
      return res.status(500).send("Internal server error.");
    }

    // ✅ Pass patients to the view
    console.log("Patients fetched:", patients);
    res.render("Doctor/viewPatients", { patients: patients });
  });
};
