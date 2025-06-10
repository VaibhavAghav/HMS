const express = require("express");
let router = express.Router();

const adminController = require("../controller/adminController");

// Route to handle POST request for adding doctor
router.post("/add-doctor", adminController.addDoctor);

module.exports = router;
