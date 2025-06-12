// doctorRouter.js

const express = require("express");
let router = express.Router();


// get doctor by username and password
let doctorController = require("../controller/doctorController");

router.get("/", doctorController.DoctorHomePage);



module.exports = router;