//receptionRouter.js
const express = require("express");
let router = express.Router();

const receptionistController = require("../controller/receptionController");
const patientController = require("../controller/patientController");
const roomController = require("../controller/roomController");
const nurseController = require("../controller/nurseController");

const isReceptionAuthenticated = require("../middleware/receptionAuthentication");

router.get("/add-patient", isReceptionAuthenticated, patientController.addPatientPage);
router.post("/add-patient", isReceptionAuthenticated, patientController.savePatient);
router.get("/view-patients", isReceptionAuthenticated, patientController.viewAllPatients);
router.get("/doctors/:specialization", isReceptionAuthenticated, patientController.getDoctorsBySpecialization);
router.get("/view-billed-patients", isReceptionAuthenticated, patientController.viewBilledPatients);
router.get("/view-unbilled-patients", isReceptionAuthenticated, patientController.viewUnbilledPatients);
router.get("/last-patient-time/:doctor_id", isReceptionAuthenticated, patientController.getLastPatientTime);
//update-patient/27
router.get("/update-patient/:id", isReceptionAuthenticated, patientController.updatePatientPage);
router.post("/update-patient/:id", isReceptionAuthenticated, patientController.updatePatient);


router.get("/", isReceptionAuthenticated, receptionistController.ReceptionHomePage);

//receptionist/bill
router.get("/bill/:id", isReceptionAuthenticated, receptionistController.BillPage);
// show-bill
router.get("/show-bill/:id", isReceptionAuthenticated, receptionistController.CompletedBillPage);
//post request to update patient status
router.post("/update-patient-status/:id", isReceptionAuthenticated, receptionistController.updatePatientStatus);

router.get("/add-room", isReceptionAuthenticated, roomController.AddRoomPage);
router.post("/add-room", isReceptionAuthenticated, roomController.AddRoom);
router.get("/view-rooms", isReceptionAuthenticated, roomController.ViewRooms);
router.get("/edit-room/:id", isReceptionAuthenticated, roomController.UpdateRoomPage);
router.post("/edit-room/:id", isReceptionAuthenticated, roomController.UpdateRoom);
router.get("/delete-room/:id", isReceptionAuthenticated, roomController.DeleteRoomPage);
router.post("/delete-room/:id", isReceptionAuthenticated, roomController.DeleteRoom);

router.get("/add-nurse", isReceptionAuthenticated, nurseController.AddNursePage);
router.post("/add-nurse", isReceptionAuthenticated, nurseController.AddNurse);
router.get("/view-nurses", isReceptionAuthenticated, nurseController.ViewNurses);
router.get("/edit-nurse/:id", isReceptionAuthenticated, nurseController.UpdateNursePage);
router.post("/edit-nurse/:id", isReceptionAuthenticated, nurseController.UpdateNurse);
router.get("/delete-nurse/:id", isReceptionAuthenticated, nurseController.DeleteNursePage);
router.post("/delete-nurse/:id", isReceptionAuthenticated, nurseController.DeleteNurse);

module.exports = router;
