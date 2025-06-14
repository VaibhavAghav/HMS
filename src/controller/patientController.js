//patientController.js
const Patient = require("../model/patientModel");
const doctor = require("../model/doctorModel");
const room = require("../model/roomModel");
const nurse = require("../model/nurseModel");
const medicine = require("../model/medicineModel");
const billModel = require("../model/billModel");

// Load Add Patient Page
exports.addPatientPage = (req, res) => {
  console.log("Add Patient Page Accessed");

  doctor.getAllSpecializations((err, specializations) => {
    if (err) return res.status(500).send("Error loading specializations");

    room.getVacantRooms((err, availableRooms) => {
      if (err) return res.status(500).send("Error loading rooms");

      nurse.getAllNurses((err, nursesList) => {
        if (err) return res.status(500).send("Error loading nurses");

        console.log("Rendering add patient page with data:", {
          specializations,
          availableRooms,
          nurses: nursesList,
        });
        res.render("Patient/addPatient", {
          specializations,
          availableRooms,
          nurses: nursesList,
        });
      });
    });
  });
};

// API to get doctors by specialization (AJAX endpoint)
exports.getDoctorsBySpecialization = (req, res) => {
  const specialization = req.params.specialization;

  doctor.getDoctorsBySpecialization(specialization, (err, doctors) => {
    if (err) {
      console.error("Error fetching doctors by specialization:", err);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
    console.log("Doctors fetched successfully for specialization:", doctors);

    res.json(doctors);
  });
};

// Add a new patient

// Add Patient Handler
exports.savePatient = (req, res) => {
  const patientData = {
    patient_name: req.body.patient_name,
    patient_age: req.body.patient_age,
    patient_gender: req.body.patient_gender,
    specialization: req.body.specialization,
    doctor_id: req.body.doctor_id,
    patient_disease: req.body.patient_disease,
    room_id: req.body.room_id,
    nurse_id: req.body.nurse_id,
    time_allocate: req.body.time_allocate,
    status: req.body.status,
  };

  console.log("Saving patient with data:", patientData);

  // Save to DB
  Patient.addPatient(patientData, (err, result) => {
    if (err) {
      return res.status(500).send("Error saving patient");
    }
    res.redirect("/receptionist/view-patients");
  });
};

// View all patients
exports.viewAllPatients = (req, res) => {
  console.log("Fetching all patients");

  Patient.getAllPatients((err, patients) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res.status(500).send("Error fetching patients");
    }
    console.log("Patients fetched successfully:", patients);

    res.render("Patient/viewPatients", { patients });
  });
};

// Get prescription for a patient
exports.getPrescription = (req, res) => {
  const patientId = req.params.id;

  Patient.getPatientById(patientId, (err, patient) => {
    if (err) {
      console.error("Error fetching patient by ID:", err);
      return res.status(500).send("Error fetching patient");
    }

    billModel.getBillsByPatientId(patientId, (err, bills) => {
      if (err) {
        console.error("Error fetching bills:", err);
        return res.status(500).send("Error fetching bills");
      }

      patient.bills = bills;

      medicine.getAllMedicines((err, medicines) => {
        if (err) {
          console.error("Error fetching medicines:", err);
          return res.status(500).send("Error fetching medicines");
        }

        if(patient.status === "Visited") {
          return  res.render("Patient/patientPrescription",{patient});
        }

        res.render("Patient/admittedPatientPrescription", {
          patient,
          medicines,
        });
      });
    });
  });
};

// Save prescription for a patient and update status
exports.savePrescription = (req, res) => {
  const patientId = req.params.id;
  const prescriptionData = req.body.medicines;
  const newStatus = req.body.status;
  const currentDate = new Date().toISOString().split("T")[0];

  if (!prescriptionData || prescriptionData.length === 0) {
    return res.status(400).send("No medicines provided.");
  }

  const billEntries = prescriptionData.map((item) => [
    patientId,
    item.medicine_id,
    item.quantity,
    currentDate,
  ]);

  // First insert into bill
  billModel.insertBills(billEntries, (err, result) => {
    if (err) {
      console.error("Error inserting bills:", err);
      return res.status(500).send("Failed to save prescription.");
    }

    console.log("Bills saved successfully:", result);

    // Then update patient status
    Patient.updatePatientStatus(patientId, newStatus, (err, result) => {
      if (err) {
        console.error("Error updating patient status:", err);
        return res.status(500).send("Failed to update patient status.");
      }

      console.log("Patient status updated successfully.");
      res.redirect(`/doctor/prescription/${patientId}`);
    });
  });
};
