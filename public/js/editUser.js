document.addEventListener("DOMContentLoaded", () => {
  const editUserForm = document.getElementById("edit-user-form");

  editUserForm.addEventListener("submit", function (event) {
    let isValid = true;

    // Name validation
    const nameInput = document.getElementById("edit-user-name");
    const nameError = document.getElementById("edit-name-error");
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Name is required.";
      nameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      nameError.textContent = "";
      nameInput.classList.remove("is-invalid");
    }

    // Phone number validation
    const phoneInput = document.getElementById("edit-user-phone");
    const phoneError = document.getElementById("edit-phone-error");
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      phoneError.textContent = "Phone number must be 10-15 digits.";
      phoneInput.classList.add("is-invalid");
      isValid = false;
    } else {
      phoneError.textContent = "";
      phoneInput.classList.remove("is-invalid");
    }

    // University ID validation
    const universityIdInput = document.getElementById("edit-user-universityId");
    const universityIdError = document.getElementById(
      "edit-universityId-error"
    );
    const universityIdPattern = /^[0-9]{4}\/[0-9]{5}$/;
    if (!universityIdPattern.test(universityIdInput.value.trim())) {
      universityIdError.textContent =
        "University ID must be in the format YYYY/XXXXX.";
      universityIdInput.classList.add("is-invalid");
      isValid = false;
    } else {
      universityIdError.textContent = "";
      universityIdInput.classList.remove("is-invalid");
    }

    // Department validation
    const departmentInput = document.getElementById("edit-user-department");
    const departmentError = document.getElementById("edit-department-error");
    if (departmentInput.value.trim() === "") {
      departmentError.textContent = "Department is required.";
      departmentInput.classList.add("is-invalid");
      isValid = false;
    } else {
      departmentError.textContent = "";
      departmentInput.classList.remove("is-invalid");
    }

    // Year validation
    const yearInput = document.getElementById("edit-user-year");
    const yearError = document.getElementById("edit-year-error");
    if (yearInput.value.trim() === "") {
      yearError.textContent = "Year is required.";
      yearInput.classList.add("is-invalid");
      isValid = false;
    } else {
      yearError.textContent = "";
      yearInput.classList.remove("is-invalid");
    }

    // Prevent form submission if validation fails
    if (!isValid) {
      event.preventDefault();
    }
  });
});
