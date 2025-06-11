const adminModel = require("../model/adminModel");

// Controller for admin homepage
exports.adminHomePage = (req, res) => {
  console.log("Inside admin homepage");
  res.render("Admin/adminHomePage");
};

// admin login page
exports.adminLoginPage = (req, res) => {
  console.log("Inside admin login page");
  res.render("Admin/adminLogin");
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

    req.session.admin = admin;

    // Redirect to add-page after successful login
    res.redirect("/admin");
  });
};

exports.addDoctor = (req, res) => {
  const doctorData = {
    doctor_name: req.body.doctor_name,
    doctor_contact: req.body.doctor_contact,
    doctor_experience: req.body.doctor_experience,
    status: req.body.status,
    spelization: req.body.spelization,
    username: req.body.username,
    password: req.body.password,
    admin_id: req.body.admin_id,
  };
  console.log(doctorData);

  adminModel.addDoctor(doctorData, (err, result) => {
    if (err) {
      console.error("Error adding doctor:", err);
      // Render a page (or redirect back to form) with a message
      return res.render("addDoctor", {
        message: "Doctor not added. Please try again.",
      });
    }

    // Redirect to admin home page on success
    res.redirect("/admin");
  });
};
