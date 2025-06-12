//userController.js

const doctorModel = require("../model/doctorModel");
const receptionModel = require("../model/receptionModel");

exports.LoginPage = (req, res) => {
  console.log("Inside controller ");
  res.render("userLogin");
};

exports.UserLogin = (req, res) => {
  console.log("Inside controller ");
  console.log(req.body);

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).send("Username, password, and role are required");
  }

  if (role === "admin" && username === "admin" && password === "admin") {
    console.log("Login successful admin");
    req.session.admin = {
      user_id: 1,
      username: "admin",
      role: "admin",
    };
    return res.redirect("/admin");
  } else if (role === "doctor") {
    doctorModel.DoctorLogin(username, password, (err, doctor) => {
      if (err) {
        return res.status(500).send("Internal server error");
      }
      if (doctor) {
        console.log("Login successful doctor");
        req.session.user = {
          username,
          role,
          doctor_id: doctor.doctor_id,
        };
        return res.redirect("/doctor");
      } else {
        return res.status(400).send("Invalid doctor credentials");
      }
    });
  } else if (role === "receptionist") {
    receptionModel.ReceptionLogin(username, password, (err, reception) => {
      if (err) {
        return res.status(500).send("Internal server error");
      }
      if (reception) {
        console.log("Login successful receptionist");
        req.session.user = {
          username,
          role,
          reception_id: reception.reception_id,
        };
        return res.redirect("/receptionist");
      } else {
        return res.status(400).send("Invalid receptionist credentials");
      }
    });
  } else {
    return res.status(400).send("Invalid credentials or role");
  }
};
