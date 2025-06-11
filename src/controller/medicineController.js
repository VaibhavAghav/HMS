// saved medicine in model
const medicineModel= require("../model/medicineModel")
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