//patientController.js
const Patient = require("../model/patientModel");
const doctor = require("../model/doctorModel");
const room = require("../model/roomModel");
const nurse = require("../model/nurseModel");
const medicine = require("../model/medicineModel");
const billModel = require("../model/billModel");
const moment = require("moment");

const patientService = require("../services/patientService");
//** */
const formatDateTimeForMySQL = (input) => {
  return moment(input).format("YYYY-MM-DD HH:mm:ss");
};
//***/
// Load Add Patient Page
exports.addPatientPage = (req, res) => {
  doctor.getAllSpecializations((err, specializations) => {
    if (err) return res.status(500).send("Error loading specializations");

    room.getVacantRooms((err, availableRooms) => {
      if (err) return res.status(500).send("Error loading rooms");
      console.log("Available rooms:", availableRooms);

      nurse.getAllNurses((err, nursesList) => {
        if (err) return res.status(500).send("Error loading nurses");

        res.render("Patient/addPatient", {
          specializations,
          availableRooms,
          nurses: nursesList,
        });
      });
    });
  });
};

exports.getLastPatientTime = (req, res) => {
  const doctorId = req.params.doctor_id;

  Patient.getLastAppointmentTime(doctorId, (err, result) => {
    if (err) {
      console.error("Error fetching last patient time:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch last appointment time" });
    }

    if (result && result.time_allocate) {
      res.json({ time_allocate: result.time_allocate });
    } else {
      res.json({ message: "No prior appointments" });
    }
  });
};

// Get doctors by specialization with next available time
exports.getDoctorsBySpecialization = (req, res) => {
  const specialization = req.params.specialization;
  const today = moment().format("YYYY-MM-DD");
  const now = moment();

  doctor.getDoctorsBySpecialization(specialization, (err, doctors) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }

    const promises = doctors.map((doc) => {
      return new Promise((resolve, reject) => {
        Patient.getLastAppointmentTimeForToday(
          doc.doctor_id,
          today,
          (err, result) => {
            if (err) return reject(err);

            let nextTime;

            if (result && result.time_allocate) {
              const lastTime = moment(result.time_allocate);
              const afterHalfHour = moment(lastTime).add(30, "minutes");

              if (afterHalfHour.isBefore(now)) {
                // Current time rounded to next half hour slot
                nextTime =
                  moment(now).minute() >= 30
                    ? moment(now).minute(0).add(1, "hour")
                    : moment(now).minute(30);
              } else {
                nextTime = afterHalfHour;
              }
            } else {
              // No appointments today
              const firstSlot = moment(today + " 09:00");
              nextTime = now.isAfter(firstSlot)
                ? now.minute() >= 30
                  ? moment(now).minute(0).add(1, "hour")
                  : moment(now).minute(30)
                : firstSlot;
            }

            // If after 5:30 PM
            const endOfDay = moment(today + " 20:30");
            if (nextTime.isAfter(endOfDay)) {
              nextTime = "Unavailable";
            }

            resolve({
              doctor_id: doc.doctor_id,
              doctor_name: doc.doctor_name,
              next_time:
                nextTime === "Unavailable"
                  ? "Unavailable"
                  : nextTime.format("YYYY-MM-DDTHH:mm"), // ISO for datetime-local input
            });
          }
        );
      });
    });

    Promise.all(promises)
      .then((results) => res.json(results))
      .catch((err) => {
        console.error("Error processing doctor availability:", err);
        res.status(500).json({ error: "Failed to fetch availability" });
      });
  });
};

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
    // time_allocate: req.body.time_allocate,
    status: req.body.status,
    time_allocate: formatDateTimeForMySQL(req.body.time_allocate),
  };

  //patientService

  console.log("Saving patient with data:", patientData);

  // Save to DB
  Patient.addPatient(patientData, (err, result) => {
    if (err) {
      return res.status(500).send("Error saving patient");
    }
    return res.redirect(
      "/receptionist/view-patients?message=Patient%20added%20successfully&type=success"
    );
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

        if (patient.status === "Visited") {
          return res.render("Patient/patientPrescription", { patient });
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

// View all patients
exports.viewAllPatients = (req, res) => {
  console.log("Fetching all patients");

  Patient.getAllPatients((err, patients) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res.status(500).send("Error fetching patients");
    }
    console.log("Patients fetched successfully:", patients);

    const message = req.query.message;
    const type = req.query.type;

    // Pass to view
    res.render("Patient/viewPatients", {
      patients: patients,
      message: message,
      type: type,
    });
  });
};

//viewBilledPatients
exports.viewBilledPatients = (req, res) => {
  console.log("Fetching billed patients");

  Patient.getBilledPatients((err, patients) => {
    if (err) {
      console.error("Error fetching billed patients:", err);
      return res.status(500).send("Error fetching billed patients");
    }
    console.log("Billed patients fetched successfully:", patients);

    res.render("Patient/viewPatients", { patients });
  });
};

//viewUnbilledPatients
exports.viewUnbilledPatients = (req, res) => {
  console.log("Fetching unbilled patients");

  Patient.getUnbilledPatients((err, patients) => {
    if (err) {
      console.error("Error fetching unbilled patients:", err);
      return res.status(500).send("Error fetching unbilled patients");
    }
    console.log("Unbilled patients fetched successfully:", patients);

    res.render("Patient/viewPatients", { patients });
  });
};

// Update Patient Page
exports.updatePatientPage = (req, res) => {
  // Get patient ID from URL
  const patientId = req.params.id;
  console.log("Fetching patient for update with ID:", patientId);
  Patient.getPatientById(patientId, (err, patient) => {
    if (err) {
      console.error("Error fetching patient by ID:", err);
      return res.status(500).send("Error fetching patient");
    }

    // Get all specializations
    doctor.getAllSpecializations((err, specializations) => {
      if (err) {
        console.error("Error fetching specializations:", err);
        return res.status(500).send("Error fetching specializations");
      }

      // Get all vacant rooms
      room.getVacantRoomsAndPatientPreviousRoom(patientId,(err, availableRooms) => {
        if (err) {
          console.error("Error fetching rooms:", err);
          return res.status(500).send("Error fetching rooms");
        }

        // Get all nurses
        nurse.getAllNurses((err, nursesList) => {
          if (err) {
            console.error("Error fetching nurses:", err);
            return res.status(500).send("Error fetching nurses");
          }

          // Render update page with patient data
          res.render("Patient/updatePatient", {
            patient,
            specializations,
            availableRooms,
            nurses: nursesList,
          });
        });
      });
    });
  });
};

//updatePatient
// controllers/patientController.js
exports.updatePatient = (req, res) => {
  const patientId = req.params.id;
  console.log("Updating patient with ID:", patientId);

  const updatedPatient = {
    patient_name: req.body.patient_name,
    patient_age: req.body.patient_age,
    patient_gender: req.body.patient_gender,
    patient_disease: req.body.patient_disease,
    doctor_id: req.body.doctor_id,
    nurse_id: req.body.nurse_id,
    room_id: req.body.room_id,
    status: req.body.status,
    time_allocate: req.body.time_allocate
  };

  Patient.updatePatient(patientId, updatedPatient, (err, result) => {
    if (err) {
      console.error("Error updating patient:", err);
      return res.status(500).send("Error updating patient record.");
    }

    // Redirect to patient list with success message
    res.redirect('/receptionist/view-patients');
  });
};
