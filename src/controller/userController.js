//userController.js

const doctorModel = require("../model/doctorModel");
const receptionModel = require("../model/receptionModel");

exports.LoginPage = (req, res) => {
  res.render("userLogin");
};

exports.UserLogin = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    // return res.status(400).send("Username, password, and role are required");
     return res.redirect("/login");
  }

  if (role === "admin" && username === "admin" && password === "admin") {
    req.session.admin = {
      user_id: 1,
      username: "admin",
      role: "admin",
    };
    return res.redirect("/admin");
  } else if (role === "doctor") {
    doctorModel.DoctorLogin(username, password, (err, doctor) => {
      if (err) return res.status(500).send("Internal server error");
      if (doctor) {
        req.session.user = {
          user_id: doctor.user_id,
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
      if (err) return res.status(500).send("Internal server error");
      if (reception) {
        req.session.user = {
          user_id: reception.user_id,
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
