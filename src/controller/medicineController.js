// saved medicine in model
const medicineModel = require("../model/medicineModel")
//1 view page for medice
exports.addMedicinePage = (req, res) => {
    console.log("Add medicine controller page view ");
    res.render("Medicine/addMedicine")
}

exports.savedMedicine = (req, res) => {
    console.log("Saved  medicne");

    const { medicine_name, price_medicine } = req.body;
    console.log(medicine_name, price_medicine);

    medicineModel.saveMedicine(medicine_name, price_medicine, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Failed to save medicine");
        }

        console.log("Medicine saved, ID:", result.insertId);
        res.redirect("/medicine/add-medicine"); // or show success page
    });
}


// 2 save to model
//callback funtion
exports.getAllMedicine = (req, res) => {
    medicineModel.getAll((err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Database error");
        } else {
            res.render("Medicine/getAllMedicine", { medicines: result });
        }
    });
};


exports.updateMedicine = (req, res) => {
    const medicine_id = req.params.medical_id;
    console.log(medicine_id);
    medicineModel.getMedicine(medicine_id, (err, result) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("DB error");
        } else {
            console.log(result);
            res.render("Medicine/updateMedicine", { medicine: result[0] });
        }
    });
};

exports.saveUpdatedMedicine = (req, res) => {
    const { medicine_id, medicine_name, price_medicine } = req.body;
    console.log(medicine_id, medicine_name, price_medicine);

    medicineModel.updateMedicine(medicine_id, medicine_name, price_medicine, (err, result) => {
        if (err) {
            console.log("Update DB error:", err);
            return res.status(500).send("Update failed");
        }
        res.redirect("/medicine/allmedicine");
    });
};

// GET: Show delete confirmation
exports.deleteMedicine = (req, res) => {
    const medicine_id = req.params.medical_id;
    medicineModel.getMedicine(medicine_id, (err, result) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("DB error");
        }
        res.render("Medicine/deleteMedicine", { medicine: result[0] });
    });
};

// POST: Delete the medicine
exports.confirmDelete = (req, res) => {
    const medicine_id = req.body.medical_id;

    medicineModel.deleteMedicine(medicine_id, (err, result) => {
        if (err) {
            console.log("Delete DB error:", err);
            return res.status(500).send("Failed to delete medicine");
        }
        res.redirect("/medicine/allmedicine");
    });
};

