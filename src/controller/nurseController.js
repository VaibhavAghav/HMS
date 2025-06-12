const nurseModel = require("../model/nurseModel");

// Render Add Nurse Page
exports.AddNursePage = (req, res) => {
  console.log("Add Nurse Page");
  res.render("Nurse/addNurse");
};

// Handle Add Nurse POST
exports.AddNurse = (req, res) => {
  const nurseData = {
    nurse_name: req.body.nurse_name,
    nurse_contact: req.body.nurse_contact,
    nurse_shift: req.body.nurse_shift,
  };

  nurseModel.addNurse(nurseData, (err, result) => {
    if (err) {
      console.error("Error adding nurse:", err);
      return res.status(500).send("Error adding nurse.");
    }
    console.log("Nurse added successfully.");
    res.redirect("view-nurses"); // or wherever your nurse list page is
  });
};

// View All Nurses
exports.ViewNurses = (req, res) => {
  nurseModel.getAllNurses((err, nurses) => {
    if (err) {
      console.error("Error fetching nurses:", err);
      return res.status(500).send("Error fetching nurses.");
    }
    console.log("Fetched all nurses successfully.");
    res.render("Nurse/viewNurses", { nurses });
  });
};

// Render Update Nurse Page
exports.UpdateNursePage = (req, res) => {
  const nurseId = req.params.id;

  // Fetch the nurse details from the database
  nurseModel.getNurseById(nurseId, (err, nurse) => {
    if (err) {
      console.error("Error fetching nurse details:", err);
      return res.status(500).send("Error fetching nurse details.");
    }
    if (!nurse) {
      return res.status(404).send("Nurse not found.");
    }
    console.log("Fetched nurse details for update successfully.");
    res.render("Nurse/updateNurse", { nurse });
  });
};

// Handle Update Nurse POST
exports.UpdateNurse = (req, res) => {
  const nurseId = req.params.id;
  const updatedData = {
    nurse_name: req.body.nurse_name,
    nurse_contact: req.body.nurse_contact,
    nurse_shift: req.body.nurse_shift,
  };

  // Update the nurse in the database
  nurseModel.updateNurse(nurseId, updatedData, (err, result) => {
    if (err) {
      console.error("Error updating nurse:", err);
      return res.status(500).send("Error updating nurse.");
    }
    console.log("Nurse updated successfully.");
    res.redirect("/receptionist/view-nurses"); // or wherever your nurse list page is
  });
};

//delete nurse
exports.DeleteNursePage = (req, res) => {
  const nurseId = req.params.id;

  // Fetch the nurse details from the database
  nurseModel.getNurseById(nurseId, (err, nurse) => {
    if (err) {
      console.error("Error fetching nurse details:", err);
      return res.status(500).send("Error fetching nurse details.");
    }
    if (!nurse) {
      return res.status(404).send("Nurse not found.");
    }
    console.log("Fetched nurse details for deletion successfully.");
    res.render("Nurse/deleteNurse", { nurse });
  });
};


// Handle Delete Nurse POST
exports.DeleteNurse = (req, res) => {
  const nurseId = req.params.id;

  // Delete the nurse from the database
  nurseModel.deleteNurse(nurseId, (err, result) => {
    if (err) {
      console.error("Error deleting nurse:", err);
      return res.status(500).send("Error deleting nurse.");
    }
    console.log("Nurse deleted successfully.");
    res.redirect("/receptionist/view-nurses"); // or wherever your nurse list page is
  });
};