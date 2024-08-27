document.addEventListener("DOMContentLoaded", function () {
  const editEventForm = document.getElementById("editEventForm");

  if (editEventForm) {
    editEventForm.addEventListener("submit", handleSubmit);
  }

  const eventTableBody = document.getElementById("event-table-body");

  if (eventTableBody) {
    eventTableBody.addEventListener("click", handleEditEventClick);
  }

  function handleEditEventClick(event) {
    if (event.target.classList.contains("edit-event-btn")) {
      event.preventDefault();
      const eventId = event.target.getAttribute("data-event-id");

      if (eventId) {
        fetchEventData(eventId);
      } else {
        console.error("Event ID not found.");
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;
    const submitButton = editEventForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    // Form validation logic...
    // If form is valid, submit using AJAX
    if (isValid) {
      const formData = new FormData(editEventForm);

      fetch("/admin/editEvent", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            editEventForm.reset();
            if (window.updateEventTable) {
              window.updateEventTable();
            }

            const editEventModal = document.getElementById("editEvent");
            const modalInstance = bootstrap.Modal.getInstance(editEventModal);
            modalInstance.hide();
          } else {
            console.error("Failed to update event:", result.message || "Unknown error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          submitButton.disabled = false;
        });
    } else {
      submitButton.disabled = false;
    }
  }

  async function fetchEventData(eventId) {
    try {
      if (!eventId) {
        throw new Error("Event ID is missing or undefined.");
      }

      const response = await fetch(`/api/events/${eventId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Event not found");
        } else {
          throw new Error(`Failed to fetch event details: ${response.statusText}`);
        }
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const eventData = await response.json();
        if (eventData.success) {
          document.getElementById("edit-event-id").value = eventData.data._id;
          document.getElementById("eventName").value = eventData.data.name;
          document.getElementById("eventDate").value = new Date(eventData.data.date).toISOString().slice(0, 10);
          document.getElementById("eventTime").value = eventData.data.time;
          document.getElementById("eventDuration").value = eventData.data.duration;
          document.getElementById("eventLocation").value = eventData.data.location;
          document.getElementById("eventDescription").value = eventData.data.description;

          const imageInput = document.getElementById("imageFile");
          if (imageInput) {
            imageInput.value = "";
          }
        }
      } else {
        throw new Error("Response is not JSON");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      alert(error.message || "Failed to fetch event details. Please try again later.");
    }
  }
});
