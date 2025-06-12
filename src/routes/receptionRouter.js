//receptionRouter.js

const express = require("express");
let router = express.Router();
let receptionistController = require("../controller/receptionController");
let patientController = require("../controller/patientController");

let roomController = require("../controller/roomController");

let nurseController = require("../controller/nurseController");

// Receptionist homepage
router.get("/", receptionistController.ReceptionHomePage);

// Add a new patient
router.get("/add-patient", patientController.addPatientPage);
router.get("/view-patients", patientController.viewAllPatients);

/// Room api
// Route to display add-room page by receptionist
router.get("/add-room", roomController.AddRoomPage);
router.post("/add-room", roomController.AddRoom);
// View all rooms
router.get("/view-rooms", roomController.ViewRooms);
// Update room
router.get("/edit-room/:id", roomController.UpdateRoomPage);
router.post("/edit-room/:id", roomController.UpdateRoom);
// Delete a room
router.get("/delete-room/:id", roomController.DeleteRoomPage);
// Post delete room
router.post("/delete-room/:id", roomController.DeleteRoom);



// Nurse api
router.get("/add-nurse", nurseController.AddNursePage);
router.post("/add-nurse", nurseController.AddNurse);
// View all nurses
router.get("/view-nurses", nurseController.ViewNurses);
//update nurse
router.get("/edit-nurse/:id", nurseController.UpdateNursePage);
router.post("/edit-nurse/:id", nurseController.UpdateNurse);
// Delete a nurse
router.get("/delete-nurse/:id", nurseController.DeleteNursePage);
//post delete nurse
router.post("/delete-nurse/:id", nurseController.DeleteNurse);

module.exports = router;
