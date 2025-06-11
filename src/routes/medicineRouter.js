const express = require("express");
let router = express.Router();

const medicineController = require("../controller/medicineController");

// page view router api
router.get("/add-medicine", medicineController.addMedicinePage)
// saved medicine api
router.post("/add-medicine", medicineController.savedMedicine)


router.get("/allmedicine", medicineController.getAllMedicine);

router.get("/update-medicine/:medical_id", medicineController.updateMedicine);

router.post("/update-medicine", medicineController.saveUpdatedMedicine);



// get for show medicine page
router.get("/delete-medicine/:medical_id", medicineController.deleteMedicine);

// post for delte medicine 
router.post("/delete-medicine", medicineController.confirmDelete);


module.exports = router;
