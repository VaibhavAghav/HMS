//adminController.js

const adminModel = require("../model/adminModel");
const patientsModel = require("../model/patientModel");

// Controller for admin homepage
exports.adminHomePage = (req, res) => {
  console.log("Inside admin homepage");
  res.render("Admin/adminHomePage");
};

// admin login page
// admin login page
exports.adminLoginPage = (req, res) => {
  console.log("Inside admin login page");
  res.render("Admin/adminLogin", { query: req.query });
};

// adding doctor page
exports.addDoctorPage = (req, res) => {
  console.log("Inside add doctor page");
  res.render("Admin/addDoctor");
};

// Controller for adding admin
exports.addAdminPage = (req, res) => {
  console.log("Inside add admin page");
  res.render("Admin/addAdmin");
};

exports.logoutAdmin = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).send("Logout failed");
    }
    res.redirect("/login");
  });
};

// Controller for editing doctor
exports.editDoctorPage = (req, res) => {
  const doctorId = req.params.id;

  if (!doctorId) {
    return res.status(400).send("Doctor ID is required");
  }

  adminModel.getDoctorById(doctorId, (err, doctor) => {
    if (err) {
      console.error("Error fetching doctor:", err);
      return res.status(500).send("Internal server error");
    }
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }
    console.log("Doctor fetched successfully:", doctor);
    res.render("Admin/updateDoctor", { doctor });
  });
};
// Controller for editing doctor
exports.editDoctor = (req, res) => {
  const doctorId = req.params.id;
  const updatedData = {
    doctor_name: req.body.doctor_name,
    doctor_contact: req.body.doctor_contact,
    doctor_experience: req.body.doctor_experience,
    status: req.body.status,
    spelization: req.body.spelization,
  };

  if (!doctorId) {
    return res.status(400).send("Doctor ID is required");
  }

  adminModel.updateDoctor(doctorId, updatedData, (err, result) => {
    if (err) {
      console.error("Error updating doctor:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/admin/view-doctors");
  });
};

// Controller for deleting doctor
exports.deleteDoctorPage = (req, res) => {
  const doctorId = req.params.id;

  if (!doctorId) {
    return res.status(400).send("Doctor ID is required");
  }

  adminModel.deleteDoctor(doctorId, (err, result) => {
    if (err) {
      console.error("Error deleting doctor:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/admin/view-doctors");
  });
};

// Controller for adding admin
exports.addAdmin = (req, res) => {
  const adminData = {
    admin_contact: req.body.admin_contact,
    admin_email: req.body.admin_email,
    username: req.body.username,
    password: req.body.password,
  };
  console.log(adminData);

  adminModel.addAdmin(adminData, (err, result) => {
    if (err) {
      console.error("Error adding admin:", err);
      res.status(500).send("Failed to add admin");
      return;
    }
    res.send("Admin added successfully!");
  });
};

// login admin
exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  adminModel.loginAdmin(username, password, (err, admin) => {
    if (err) {
      console.error("Error during admin login:", err);
      return res.status(500).send("Internal server error");
    }
    if (!admin) {
      return res.status(401).send("Invalid username or password");
    }

    req.session.admin = {
      user_id: admin.admin_id,
      username: admin.username,
      role: admin.role,
    };
    console.log("Admin logged in:", req.session.admin);

    // Redirect to add-page after successful login
    res.redirect("/admin");
  });
};

exports.addDoctor = (req, res) => {
  const adminSession = req.session.admin;

  if (!adminSession) {
    return res.status(401).send("Unauthorized — Please login as admin.");
  }

  const doctorData = {
    doctor_name: req.body.doctor_name,
    doctor_contact: req.body.doctor_contact,
    doctor_experience: req.body.doctor_experience,
    status: req.body.status,
    spelization: req.body.spelization,
    username: req.body.username,
    password: req.body.password,
    admin_id: adminSession.user_id,
  };

  console.log(doctorData);

  adminModel.addDoctor(doctorData, (err, result) => {
    if (err) {
      console.error("Error adding doctor:", err);
      return res.render("Admin/addDoctor", {
        message: "Doctor not added. Please try again.",
        messageType: "danger",
      });
    }

    return res.render("Admin/addDoctor", {
      message: "Doctor added successfully!",
      messageType: "success",
    });
  });
};

// Controller for doctor list page
exports.doctorListPage = (req, res) => {
  const adminSession = req.session.admin;

  if (!adminSession) {
    return res.status(401).send("Unauthorized — Please login as admin.");
  }

  adminModel.getAllDoctors((err, doctors) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).send("Internal server error");
    }
    console.log("Doctors fetched successfully:", doctors);

    res.render("Admin/viewDoctors", { doctors });
  });
};

exports.receptionistListPage = (req, res) => {
  const adminSession = req.session.admin;

  if (!adminSession) {
    return res.status(401).send("Unauthorized — Please login as admin.");
  }

  adminModel.getAllReceptionists((err, receptionists) => {
    if (err) {
      console.error("Error fetching receptionists:", err);
      return res.status(500).send("Internal server error");
    }
    console.log("Receptionists fetched successfully:", receptionists);
    res.render("Admin/viewReceptionists", { receptionists });
  });
};

// add receptionist page
exports.addReceptionistPage = (req, res) => {
  console.log("Inside add receptionist page");
  res.render("Admin/addReceptionist");
};

// Controller for adding receptionist
exports.addReceptionist = (req, res) => {
  const adminSession = req.session.admin;

  if (!adminSession) {
    return res.status(401).send("Unauthorized — Please login as admin.");
  }

  const receptionistData = {
    reception_name: req.body.reception_name,
    reception_contact: req.body.reception_contact,
    username: req.body.username,
    password: req.body.password,
    admin_id: adminSession.user_id,
  };

  console.log(receptionistData);

  adminModel.addReceptionist(receptionistData, (err, result) => {
    if (err) {
      console.error("Error adding receptionist:", err);
      return res.render("Admin/addReceptionist", {
        message: "Receptionist not added. Please try again.",
        messageType: "danger",
      });
    }

    return res.render("Admin/addReceptionist", {
      message: "Receptionist added successfully!",
      messageType: "success",
    });
  });
};

//edit receptionist page
exports.editReceptionistPage = (req, res) => {
  const receptionistId = req.params.id;

  if (!receptionistId) {
    return res.status(400).send("Receptionist ID is required");
  }

  adminModel.getReceptionistById(receptionistId, (err, receptionist) => {
    if (err) {
      console.error("Error fetching receptionist:", err);
      return res.status(500).send("Internal server error");
    }
    if (!receptionist) {
      return res.status(404).send("Receptionist not found");
    }

    res.render("Admin/updateReceptionist", { receptionist });
  });
};
// Controller for editing receptionist
exports.editReceptionist = (req, res) => {
  const receptionistId = req.params.id;
  const updatedData = {
    reception_name: req.body.reception_name,
    reception_contact: req.body.reception_contact,
    username: req.body.username,
    password: req.body.password,
  };

  if (!receptionistId) {
    return res.status(400).send("Receptionist ID is required");
  }

  adminModel.updateReceptionist(receptionistId, updatedData, (err, result) => {
    if (err) {
      console.error("Error updating receptionist:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/admin/view-receptionists");
  });
};

// Controller for deleting receptionist
exports.deleteReceptionistPage = (req, res) => {
  const receptionistId = req.params.id;

  if (!receptionistId) {
    return res.status(400).send("Receptionist ID is required");
  }

  adminModel.deleteReceptionist(receptionistId, (err, result) => {
    if (err) {
      console.error("Error deleting receptionist:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/admin/view-receptionists");
  });
};

// View all patients
exports.viewAllPatients = (req, res) => {
  console.log("Fetching all patients");

  patientsModel.getAllPatients((err, patients) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res.status(500).send("Error fetching patients");
    }
    console.log("Patients fetched successfully:", patients);

    const message = req.query.message;
    const type = req.query.type;

    // Pass to view
    res.render("Admin/viewPatients", {
      patients: patients,
      message: message,
      type: type,
    });
  });
};
