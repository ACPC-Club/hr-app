document.addEventListener("DOMContentLoaded", () => {
  let blogIdToDelete = null;

  document.querySelectorAll(".delete-blog-btn").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      // Capture the blog ID from the button's dataset or from the form action
      blogIdToDelete = this.closest("form").action.split("/").pop();

      // Show the modal
      $("#deleteBlogModal").modal("show");
    });
  });

  document
    .getElementById("confirm-delete-blog-btn")
    .addEventListener("click", function () {
      if (blogIdToDelete) {
        // AJAX Request
        fetch(`/admin/blogs/delete/${blogIdToDelete}`, {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              $("#deleteBlogModal").modal("hide");
              alert("Blog deleted successfully!");
              location.reload(); // Reload the page to see the updated blog list
            } else {
              alert("Failed to delete blog.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while deleting the blog.");
          });
      }
    });
});
