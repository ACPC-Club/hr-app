// addEvent.js
document.addEventListener("DOMContentLoaded", () => {
  const addEventForm = document.getElementById("add-event-form");

  addEventForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    let isValid = true;

    // Disable the submit button to prevent multiple submissions
    const submitButton = addEventForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    // Current date and time for comparison
    const now = new Date();

    // Title validation
    const titleInput = document.getElementById("add-event-title");
    const titleError = document.getElementById("add-title-error");
    if (titleInput.value.trim() === "") {
      titleError.textContent = "Title is required.";
      titleInput.classList.add("is-invalid");
      isValid = false;
    } else {
      titleError.textContent = "";
      titleInput.classList.remove("is-invalid");
    }

    // Date validation
    const dateInput = document.getElementById("add-event-date");
    const dateError = document.getElementById("add-date-error");
    const selectedDate = new Date(dateInput.value);
    if (dateInput.value.trim() === "") {
      dateError.textContent = "Date is required.";
      dateInput.classList.add("is-invalid");
      isValid = false;
    } else if (selectedDate < now) {
      dateError.textContent = "Date cannot be in the past.";
      dateInput.classList.add("is-invalid");
      isValid = false;
    } else {
      dateError.textContent = "";
      dateInput.classList.remove("is-invalid");
    }

    // Time validation
    const timeInput = document.getElementById("add-event-time");
    const timeError = document.getElementById("add-time-error");
    if (timeInput.value.trim() === "") {
      timeError.textContent = "Time is required.";
      timeInput.classList.add("is-invalid");
      isValid = false;
    } else {
      const selectedTime = new Date(`${dateInput.value}T${timeInput.value}`);
      if (selectedTime < now) {
        timeError.textContent = "Time cannot be in the past.";
        timeInput.classList.add("is-invalid");
        isValid = false;
      } else {
        timeError.textContent = "";
        timeInput.classList.remove("is-invalid");
      }
    }

    // Duration validation
    const durationInput = document.getElementById("add-event-duration");
    const durationError = document.getElementById("add-duration-error");
    if (durationInput.value.trim() === "") {
      durationError.textContent = "Duration is required.";
      durationInput.classList.add("is-invalid");
      isValid = false;
    } else {
      durationError.textContent = "";
      durationInput.classList.remove("is-invalid");
    }

    // Location validation
    const locationInput = document.getElementById("add-event-location");
    const locationError = document.getElementById("add-location-error");
    if (locationInput.value.trim() === "") {
      locationError.textContent = "Location is required.";
      locationInput.classList.add("is-invalid");
      isValid = false;
    } else {
      locationError.textContent = "";
      locationInput.classList.remove("is-invalid");
    }

    // Description validation
    const descriptionInput = document.getElementById("add-event-description");
    const descriptionError = document.getElementById("add-description-error");
    if (descriptionInput.value.trim() === "") {
      descriptionError.textContent = "Description is required.";
      descriptionInput.classList.add("is-invalid");
      isValid = false;
    } else {
      descriptionError.textContent = "";
      descriptionInput.classList.remove("is-invalid");
    }

    // Image validation
    const imageInput = document.getElementById("add-event-image");
    const imageError = document.getElementById("add-image-error");
    if (imageInput.files.length === 0) {
      imageError.textContent = "Image is required.";
      imageInput.classList.add("is-invalid");
      isValid = false;
    } else {
      imageError.textContent = "";
      imageInput.classList.remove("is-invalid");
    }

    // If form is valid, submit using AJAX
    if (isValid) {
      const formData = new FormData(addEventForm);

      fetch("/admin/addEvent", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok"); // Handle non-200 responses
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            addEventForm.reset(); // Optionally, reset the form fields
            
            // Notify eventManagement.js to refresh the event table
            if (window.updateEventTable) {
              window.updateEventTable();
            }

            // Close the modal after successful event addition
            const addEventModal = document.getElementById("addEventModal");
            const modalInstance = bootstrap.Modal.getInstance(addEventModal);
            modalInstance.hide();
          } else {
            console.error("Failed to add event:", data.message || "Unknown error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          submitButton.disabled = false; // Re-enable the button after processing
        });
    } else {
      submitButton.disabled = false; // Re-enable if validation fails
    }
  });
});
