document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form[action='add-patient']");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    const errors = document.querySelectorAll(".text-danger");
    errors.forEach((err) => err.remove());

    let isValid = true;

    // Helper function for displaying errors
    function showError(input, message) {
      const errorElement = document.createElement("small");
      errorElement.classList.add("text-danger");
      errorElement.innerText = message;
      input.parentElement.appendChild(errorElement);
    }

    // Full Name Validation
    const nameInput = form.querySelector("#patient_name");
    const nameValue = nameInput.value.trim();
    if (nameValue === "" || nameValue.length < 3) {
      isValid = false;
      showError(nameInput, "Full name must be at least 3 characters.");
    }

    // Age Validation
    const ageInput = form.querySelector("#patient_age");
    const ageValue = ageInput.value.trim();
    if (ageValue === "" || isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
      isValid = false;
      showError(ageInput, "Enter a valid age between 1 and 120.");
    }

    // Gender Validation
    const genderInput = form.querySelector("#patient_gender");
    if (genderInput.value === "") {
      isValid = false;
      showError(genderInput, "Please select gender.");
    }

    // Disease Validation
    const diseaseInput = form.querySelector("#patient_disease");
    const diseaseValue = diseaseInput.value.trim();
    if (diseaseValue === "" || diseaseValue.length < 3) {
      isValid = false;
      showError(
        diseaseInput,
        "Primary diagnosis must be at least 3 characters."
      );
    }

    // Specialization Validation
    const specializationInput = form.querySelector("#specialization");
    if (specializationInput.value === "") {
      isValid = false;
      showError(specializationInput, "Please select specialization.");
    }

    // Doctor Validation
    const doctorInput = form.querySelector("#doctor_id");
    if (doctorInput.value === "") {
      isValid = false;
      showError(doctorInput, "Please select attending physician.");
    }

    // Status Validation
    const statusInput = form.querySelector("#status");
    if (statusInput.value === "") {
      isValid = false;
      showError(statusInput, "Please select admission status.");
    }

    // Appointment Time Validation
    const timeInput = form.querySelector("#time_allocate");
    const timeValue = timeInput.value.trim();

    if (timeValue === "") {
      isValid = false;
      showError(timeInput, "Please select appointment date and time.");
    } else {
      const selectedDateTime = new Date(timeValue);
      const currentDateTime = new Date();

      if (selectedDateTime <= currentDateTime) {
        isValid = false;
        showError(timeInput, "Appointment time must be in the future.");
      }
    }
    if (isValid) {
      form.submit();
    }
  });
});
