//adminRouter.js

const express = require("express");
let router = express.Router();

const adminController = require("../controller/adminController");
const isAdminAuthenticated = require("../middleware/adminAuthentication"); // adjust path if needed

// admin homepage after login — PROTECTED
router.get("/", isAdminAuthenticated, adminController.adminHomePage);

// add doctor page — PROTECTED
router.get("/add-doctor", isAdminAuthenticated, adminController.addDoctorPage);  //*

// add doctor post — PROTECTED
router.post("/add-doctor", isAdminAuthenticated, adminController.addDoctor);  //*

// doctor list page — PROTECTED
router.get("/view-doctors", isAdminAuthenticated, adminController.doctorListPage); //-
//edit doctor page — PROTECTED
router.get("/edit-doctor/:id", isAdminAuthenticated, adminController.editDoctorPage);//-
// edit doctor post — PROTECTED
router.post("/edit-doctor/:id", isAdminAuthenticated, adminController.editDoctor);//-
// delete doctor — PROTECTED
router.get("/delete-doctor/:id", isAdminAuthenticated, adminController.deleteDoctorPage);//-

// add admin get page — PROTECTED
router.get("/add-admin", isAdminAuthenticated, adminController.addAdminPage);

// add admin post — PROTECTED
router.post("/add-admin", isAdminAuthenticated, adminController.addAdmin);

//add receiptionist page — PROTECTED
router.get("/add-receptionist", isAdminAuthenticated, adminController.addReceptionistPage); //-
// add receiptionist post — PROTECTED
router.post("/add-receptionist", isAdminAuthenticated, adminController.addReceptionist);//-
// view receptionists page — PROTECTED
router.get("/view-receptionists", adminController.receptionistListPage);   //*
// edit receptionist page — PROTECTED
router.get("/edit-receptionist/:id", isAdminAuthenticated, adminController.editReceptionistPage); //*
// edit receptionist post — PROTECTED
router.post("/edit-receptionist/:id", isAdminAuthenticated, adminController.editReceptionist); //*
// delete receptionist — PROTECTED
router.get("/delete-receptionist/:id", isAdminAuthenticated, adminController.deleteReceptionistPage); //*



// admin login page — PUBLIC
router.get("/login", adminController.adminLoginPage);

// admin login post — PUBLIC
router.post("/login", adminController.loginAdmin);

// admin logout — PROTECTED (optional, but good practice)
router.get("/logout", isAdminAuthenticated, adminController.logoutAdmin);

module.exports = router;
