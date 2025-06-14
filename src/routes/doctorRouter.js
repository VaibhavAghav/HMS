// doctorRouter.js

const express = require("express");
let router = express.Router();


// get doctor by username and password
let doctorController = require("../controller/doctorController");
let patientController = require("../controller/patientController");

router.get("/", doctorController.DoctorHomePage);

// view-patients
router.get("/view-non-visited-patients", doctorController.viewNoVisitedPatients);

//view-admited-patients
router.get("/view-admited-patients",doctorController.viewAdmitedPatient);

//view-visited-patients
router.get("/view-visited-patients", doctorController.viewVisitedPatients);

//api's prescription
router.get("/prescription/:id", patientController.getPrescription);
//post prescription
router.post("/prescription/:id", patientController.savePrescription);


module.exports = router;