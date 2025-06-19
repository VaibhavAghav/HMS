document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form[action='add-receptionist']");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear old errors
    const errorMessages = document.querySelectorAll(".text-danger");
    errorMessages.forEach((msg) => msg.remove());

    let isValid = true;

    // Field validations
    const fields = [
      { name: "reception_name", message: "Receptionist name is required." },
      {
        name: "reception_contact",
        message: "Contact number is required.",
        pattern: /^\d{10,12}$/,
        patternMessage: "Contact number must be 10-12 digits.",
      },
    ];

    fields.forEach((field) => {
      const input = form.querySelector(`[name='${field.name}']`);
      const value = input.value.trim();

      let error = null;

      if (value === "") {
        error = field.message;
      } else if (field.pattern && !field.pattern.test(value)) {
        error = field.patternMessage;
      }

      if (error) {
        isValid = false;
        showError(input, error);
      }
    });

    // Username Validation
    const usernameInput = form.querySelector("[name='username']");
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

    // Password Validation
    const passwordInput = form.querySelector("[name='password']");
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
