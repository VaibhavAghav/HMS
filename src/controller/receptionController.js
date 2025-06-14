//receptionController.js

const receptionModel = require("../model/receptionModel");

// Receptionist Homepage Controller
exports.ReceptionHomePage = (req, res) => {
  console.log("Inside receptionist homepage");

  const userId = req.session.user ? req.session.user.user_id : null;

  if (!userId) {
    return res.redirect("/login");
  }

  receptionModel.getReceptionDetailsByUserId(userId, (err, reception) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (!reception) {
      return res.status(404).send("Receptionist details not found.");
    }

    // Pass reception details to view
    res.render("Reception/receptionHomePage", {
      reception,
    });
  });
};

// Bill Page Controller
exports.BillPage = (req, res) => {
  const patientId = req.params.id;

  receptionModel.getPatientBillsByPatientId(patientId, (err, bills) => {
    if (err) {
      console.error("Error fetching patient full bill details by ID:", err);
      return res.status(500).send("Error fetching bills");
    }

    if (!bills) {
      return res.status(404).send("No bills found for this patient");
    }

    res.render("Reception/billPage", { bills });
  });
};

// Update Patient Status Controller
exports.updatePatientStatus = (req, res) => {
  const patientId = req.params.id;
  const status = req.body.status;

  receptionModel.updatePatientStatus(patientId, status, (err, result) => {
    if (err) {
      console.error("Error updating patient status:", err);
      return res.status(500).send("Error updating patient status");
    }

    res.redirect("/receptionist/view-patients");
  });
};

