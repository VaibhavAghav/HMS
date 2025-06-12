//receptionRouter.js

const express = require("express");
let router = express.Router();
let receptionistController = require("../controller/receptionController");
let patientController = require("../controller/patientController");

let roomController = require("../controller/roomController");

// Receptionist homepage
router.get("/", receptionistController.ReceptionHomePage);

// Add a new patient
router.get("/add-patient", patientController    .addPatientPage);
router.get('/view-patients', patientController.viewAllPatients);




////////////////////////////////
/// Room api

router.get("/add-room", roomController.AddRoomPage);


module.exports = router;
