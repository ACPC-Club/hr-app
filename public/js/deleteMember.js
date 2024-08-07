document.addEventListener("DOMContentLoaded", () => {
  const memberTableBody = document.getElementById("member-table-body");
  // Handle the click event for delete buttons
  memberTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-user-btn")) {
      event.preventDefault();
      userIdToDelete = event.target.getAttribute("data-user-id");
    }
  });

  // Handle the confirm delete button click
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", async () => {
      if (userIdToDelete) {
        try {
          const response = await fetch(
            `/admin/deleteMember/${userIdToDelete}`,
            {
              method: "DELETE",
            }
          );
          const result = await response.json();
          if (result.success) {
            window.location.reload();
          } else {
            alert("Failed to delete user");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user");
        }
      }
      // Hide the delete confirmation modal
      $("#deleteConfirmation").modal("hide");
    });
});
