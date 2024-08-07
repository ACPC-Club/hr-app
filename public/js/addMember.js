document.addEventListener("DOMContentLoaded", () => {
  const addMemberForm = document.getElementById("add-member-form");

  addMemberForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    let isValid = true;

    // Name validation
    const nameInput = document.getElementById("add-user-name");
    const nameError = document.getElementById("add-name-error");
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Name is required.";
      nameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      nameError.textContent = "";
      nameInput.classList.remove("is-invalid");
    }

    // Phone number validation
    const phoneInput = document.getElementById("add-user-phone");
    const phoneError = document.getElementById("add-phone-error");
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
    const universityIdInput = document.getElementById("add-user-universityId");
    const universityIdError = document.getElementById("add-universityId-error");
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
    const departmentInput = document.getElementById("add-user-department");
    const departmentError = document.getElementById("add-department-error");
    if (departmentInput.value.trim() === "") {
      departmentError.textContent = "Department is required.";
      departmentInput.classList.add("is-invalid");
      isValid = false;
    } else {
      departmentError.textContent = "";
      departmentInput.classList.remove("is-invalid");
    }

    // Year validation
    const yearInput = document.getElementById("add-user-year");
    const yearError = document.getElementById("add-year-error");
    if (yearInput.value.trim() === "") {
      yearError.textContent = "Year is required.";
      yearInput.classList.add("is-invalid");
      isValid = false;
    } else {
      yearError.textContent = "";
      yearInput.classList.remove("is-invalid");
    }

    // If form is valid, submit using AJAX
    if (isValid) {
      const formData = {
        userName: nameInput.value.trim(),
        userPhone: phoneInput.value.trim(),
        userUniversityId: universityIdInput.value.trim(),
        userDepartment: departmentInput.value.trim(),
        userYear: yearInput.value.trim(),
        isBoardMember: document.getElementById("add-user-boardMember").checked,
      };

      fetch("/admin/addMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            location.reload(); // Reload the page to see the new member
          } else {
            alert("Failed to add member.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while adding the member.");
        });
    }
  });
});
