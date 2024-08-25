document.addEventListener("DOMContentLoaded", () => {
  let eventIdToDelete = null;

  document.getElementById("event-table-body").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-event-btn")) {
      event.preventDefault();
      eventIdToDelete = event.target.getAttribute("data-event-id");
      console.log("Event ID to delete:", eventIdToDelete); // Debugging
      $("#deleteEventConfirmation").modal("show");
    }
  });

  document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
    if (eventIdToDelete) {
      try {
        const response = await fetch(`/admin/deleteEvent/${eventIdToDelete}`, {
          method: "DELETE",
        });

        // Debugging
        console.log("Response Status:", response.status);
        console.log("Response URL:", response.url);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error deleting event: HTTP error! Status: ${response.status}, Message: ${errorText}`);
          alert(`Failed to delete event: ${errorText}`);
          return;
        }

        const result = await response.json();
        console.log("Server response:", result);

        if (result.success) {
          if (window.fetchEvents) {
            window.fetchEvents();
          }
          $("#deleteEventConfirmation").modal("hide");
        } else {
          console.error("Deletion failed:", result.message);
          alert(`Failed to delete event: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(`Failed to delete event: ${error.message}`);
      }
    } else {
      console.error("No event ID to delete");
    }
  });
});
