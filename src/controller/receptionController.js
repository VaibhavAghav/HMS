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
