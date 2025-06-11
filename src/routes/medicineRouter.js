const express = require("express");
let router = express.Router();

const medicineController = require("../controller/medicineController");

// page view router api
router.get("/add-medicine", medicineController.addMedicinePage)

// saved medicine api
router.post("/add-medicine", medicineController.savedMedicine)


module.exports = router;
