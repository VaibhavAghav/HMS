document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form[action='add-doctor']");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous errors
    const errorMessages = document.querySelectorAll(".text-danger");
    errorMessages.forEach((msg) => msg.remove());

    let isValid = true;

    // Validation logic
    const fields = [
      { id: "doctor_name", message: "Doctor name is required." },
      {
        id: "doctor_contact",
        message: "Contact number is required.",
        pattern: /^\d{10,12}$/,
        patternMessage: "Contact number must be 10-12 digits.",
      },
      {
        id: "doctor_experience",
        message: "Experience is required.",
        min: 0,
        minMessage: "Experience cannot be negative.",
      },
      { id: "spelization", message: "Specialization is required." },
      { id: "status", message: "Please select a status." },
    ];

    fields.forEach((field) => {
      const input = document.getElementById(field.id);
      const value = input.value.trim();

      let error = null;

      if (value === "") {
        error = field.message;
      } else if (field.pattern && !field.pattern.test(value)) {
        error = field.patternMessage;
      } else if (field.min !== undefined && parseInt(value) < field.min) {
        error = field.minMessage;
      }

      if (error) {
        isValid = false;
        showError(input, error);
      }
    });

    // Username Validation (Gmail only + at least 5 chars before @)
    const usernameInput = document.getElementById("username");
    const usernameValue = usernameInput.value.trim();
    if (usernameValue === "") {
      isValid = false;
      showError(usernameInput, "Username is required.");
    } else if (!usernameValue.endsWith("@gmail.com")) {
      isValid = false;
      showError(usernameInput, "Username must be a valid Gmail address.");
    } else if (usernameValue.split("@")[0].length < 5) {
      isValid = false;
      showError(
        usernameInput,
        "Username before '@' must be at least 5 characters."
      );
    }

    // Password Validation (Minimum 5 characters)
    const passwordInput = document.getElementById("password");
    const passwordValue = passwordInput.value.trim();
    if (passwordValue === "") {
      isValid = false;
      showError(passwordInput, "Password is required.");
    } else if (passwordValue.length < 5) {
      isValid = false;
      showError(passwordInput, "Password must be at least 5 characters.");
    }

    if (isValid) {
      form.submit();
    }
  });

  function showError(input, message) {
    const errorElement = document.createElement("small");
    errorElement.classList.add("text-danger");
    errorElement.innerText = message;
    input.parentElement.appendChild(errorElement);
  }
});
