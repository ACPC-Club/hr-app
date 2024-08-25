document.addEventListener("DOMContentLoaded", () => {
    let eventIdToDelete = null;
  
    // Handle the click event for delete buttons
    document.getElementById("event-table-body").addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-event-btn")) {
        event.preventDefault();
        eventIdToDelete = event.target.getAttribute("data-event-id");
  
        // Show the delete confirmation modal
        $("#deleteEventConfirmation").modal("show");
      }
    });
  
    // Handle the confirm delete button click
    document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
      if (eventIdToDelete) {
        try {
          const response = await fetch(`/admin/deleteEvent/${eventIdToDelete}`, {
            method: "DELETE",
          });
          const result = await response.json();

          console.log("Server response:", result); // Log the server response
  
          if (result.success) {
            window.location.reload(); // Reload the page after successful deletion
          } else {
            alert("Failed to delete event");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
          alert("Failed to delete event");
        }
      }
      
      // Hide the delete confirmation modal
      $("#deleteEventConfirmation").modal("hide");
    });
  });
