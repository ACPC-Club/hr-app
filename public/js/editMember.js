document.addEventListener("DOMContentLoaded", function () {
  const saveChangesButton = document.getElementById("save-changes");
  const editMemberForm = document.getElementById("edit-user-form");
  const addWarningButton = document.getElementById("add-warning");
  const warningsContainer = document.getElementById("edit-user-warnings");

  let warningIndex = 0;

  addWarningButton.addEventListener("click", function () {
    const warningInput = document.createElement("div");
    warningInput.classList.add("input-group", "mb-2");
    warningInput.innerHTML = `
      <input type="text" class="form-control" name="userWarnings" placeholder="Enter warning" required />
      <button type="button" class="btn btn-danger btn-sm remove-warning">Remove</button>
    `;
    warningsContainer.appendChild(warningInput);

    warningInput
      .querySelector(".remove-warning")
      .addEventListener("click", function () {
        warningInput.remove();
      });

    warningIndex++;
  });

  saveChangesButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Clear previous errors
    document
      .querySelectorAll(".invalid-feedback")
      .forEach((el) => (el.textContent = ""));

    // Custom validation for phone number and university ID
    const phoneNumberField = document.getElementById("edit-user-phone");
    const universityIdField = document.getElementById("edit-user-universityId");
    const phoneNumber = phoneNumberField.value.trim();
    const universityId = universityIdField.value.trim();
    let isValid = true;

    // Validate phone number (must be 10-15 digits)
    const phoneNumberRegex = /^\d{10,15}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      phoneNumberField.classList.add("is-invalid");
      document.getElementById("edit-userPhone-error").textContent =
        "Please enter a valid phone number (10-15 digits).";
      isValid = false;
    } else {
      phoneNumberField.classList.remove("is-invalid");
    }

    // Validate university ID (must be in format YYYY/NNNNN)
    const universityIdRegex = /^\d{4}\/\d{5}$/;
    if (!universityIdRegex.test(universityId)) {
      universityIdField.classList.add("is-invalid");
      document.getElementById("edit-userUniversityId-error").textContent =
        "Please enter a valid university ID (e.g., 2021/00977).";
      isValid = false;
    } else {
      universityIdField.classList.remove("is-invalid");
    }

    // Check other form fields validity
    if (!editMemberForm.checkValidity() || !isValid) {
      // Add custom validation feedback
      const fields = editMemberForm.elements;
      for (let i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) {
          fields[i].classList.add("is-invalid");
          const errorElement = document.getElementById(
            `edit-${fields[i].name}-error`
          );
          if (errorElement) {
            errorElement.textContent = fields[i].validationMessage;
          }
        } else {
          fields[i].classList.remove("is-invalid");
        }
      }
      return;
    }

    // Gather form data
    const formData = new FormData(editMemberForm);
    const data = {};
    formData.forEach((value, key) => {
      if (key in data) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });

    // Collect warnings into an array
    const warnings = [];
    document.querySelectorAll('input[name="userWarnings"]').forEach((input) => {
      warnings.push(input.value);
    });
    data.userWarnings = warnings;

    // Handle checkbox value for isBoardMember
    data.isBoardMember = formData.get("isBoardMember") === "on";

    // Send data to the server using AJAX
    fetch("/admin/editMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // Optionally, refresh the page or update the UI dynamically
          window.location.reload();
        } else {
          // Handle errors returned from the server
          alert("Failed to update user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update user");
      });
  });

  // Handle the click event for edit buttons
  document
    .getElementById("member-table-body")
    .addEventListener("click", async (event) => {
      if (event.target.classList.contains("edit-user-btn")) {
        event.preventDefault();
        const userId = event.target.getAttribute("data-user-id");
        try {
          const response = await fetch(`/admin/api/members/${userId}`);
          const user = await response.json();
          if (user) {
            // Populate the form fields
            document.getElementById("edit-user-id").value = user._id;
            document.getElementById("edit-user-name").value = user.name;
            document.getElementById("edit-user-phone").value = user.phoneNumber;
            document.getElementById("edit-user-universityId").value =
              user.universityId;
            document.getElementById("edit-user-department").value =
              user.department;
            document.getElementById("edit-user-year").value = user.year;
            document.getElementById("edit-user-points").value = user.points;
            document.getElementById("edit-user-boardMember").checked =
              user.isBoardMember;

            // Populate warnings
            warningsContainer.innerHTML = "";
            user.warnings.forEach((warning, index) => {
              const warningInput = document.createElement("div");
              warningInput.classList.add("input-group", "mb-2");
              warningInput.innerHTML = `
             <input type="text" class="form-control" name="userWarnings" value="${warning}" required />
             <button type="button" class="btn btn-danger btn-sm remove-warning">Remove</button>
           `;
              warningsContainer.appendChild(warningInput);
              warningInput
                .querySelector(".remove-warning")
                .addEventListener("click", function () {
                  warningInput.remove();
                });
            });
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });
});
