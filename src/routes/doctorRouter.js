// doctorRouter.js

const express = require("express");
let router = express.Router();


// get doctor by username and password
let doctorController = require("../controller/doctorController");
let patientController = require("../controller/patientController");

router.get("/", doctorController.DoctorHomePage);

// view-patients
router.get("/view-patients", doctorController.viewPatients);

//api's prescription
router.get("/prescription/:id", patientController.getPrescription);
//post prescription
router.post("/prescription/:id", patientController.savePrescription);

module.exports = router;