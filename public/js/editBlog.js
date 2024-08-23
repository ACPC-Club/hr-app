document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[id^='editBlogModal']").forEach((modal) => {
    const editBlogForm = modal.querySelector("form");

    editBlogForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      let isValid = true;

      // Title validation
      const titleInput = modal.querySelector("[id^='title']");
      const titleError = modal.querySelector("[id^='title-error']");
      if (titleInput.value.trim() === "") {
        titleError.textContent = "Title is required.";
        titleInput.classList.add("is-invalid");
        isValid = false;
      } else {
        titleError.textContent = "";
        titleInput.classList.remove("is-invalid");
      }

      // Author validation
      const authorInput = modal.querySelector("[id^='author']");
      const authorError = modal.querySelector("[id^='author-error']");
      if (authorInput.value.trim() === "") {
        authorError.textContent = "Author is required.";
        authorInput.classList.add("is-invalid");
        isValid = false;
      } else {
        authorError.textContent = "";
        authorInput.classList.remove("is-invalid");
      }

      // Brief validation
      const briefInput = modal.querySelector("[id^='brief']");
      const briefError = modal.querySelector("[id^='brief-error']");
      if (briefInput.value.trim() === "") {
        briefError.textContent = "Brief is required.";
        briefInput.classList.add("is-invalid");
        isValid = false;
      } else {
        briefError.textContent = "";
        briefInput.classList.remove("is-invalid");
      }

      // Content validation
      const contentInput = modal.querySelector("[id^='content']");
      const contentError = modal.querySelector("[id^='content-error']");
      if (contentInput.value.trim() === "") {
        contentError.textContent = "Content is required.";
        contentInput.classList.add("is-invalid");
        isValid = false;
      } else {
        contentError.textContent = "";
        contentInput.classList.remove("is-invalid");
      }

      // Image validation (optional, depending on if a new image is uploaded)
      const imageInput = modal.querySelector("[id^='image']");
      const imageError = modal.querySelector("[id^='image-error']");
      if (imageInput.files.length > 0 && imageInput.files[0].size > 1048576) {
        imageError.textContent = "Image size should be less than 1MB.";
        imageInput.classList.add("is-invalid");
        isValid = false;
      } else {
        imageError.textContent = "";
        imageInput.classList.remove("is-invalid");
      }

      // If form is valid, submit using AJAX
      if (isValid) {
        const formData = new FormData(editBlogForm);
        const blogId = editBlogForm.action.split("/").pop();

        fetch(`/admin/blogs/edit/${blogId}`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              location.reload(); // Reload the page to see the updated blog
            } else {
              alert("Failed to edit blog.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while editing the blog.");
          });
      }
    });
  });
});
