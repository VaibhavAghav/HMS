const express = require("express");
let router = express.Router();

const adminController = require("../controller/adminController");

// admin homepage after login
router.get("/", adminController.adminHomePage);

// get request for add doctor page
router.get("/add-doctor", adminController.addDoctorPage);
// Route to handle post request for adding doctor by admin
router.post("/add-doctor", adminController.addDoctor);

//add admin get request
router.get("/add-admin", adminController.addAdminPage);
//add another admin
router.post("/add-admin", adminController.addAdmin);

//admin login page
router.get("/login", adminController.adminLoginPage);

// Route to handle post request for admin login
router.post("/login", adminController.loginAdmin);

module.exports = router;
