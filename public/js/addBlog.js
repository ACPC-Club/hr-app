document.addEventListener("DOMContentLoaded", () => {
  const addBlogForm = document.getElementById("add-blog-form");

  addBlogForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    let isValid = true;

    // Title validation
    const titleInput = document.getElementById("blog-title");
    const titleError = document.getElementById("title-error");
    if (titleInput.value.trim() === "") {
      titleError.textContent = "Title is required.";
      titleInput.classList.add("is-invalid");
      isValid = false;
    } else {
      titleError.textContent = "";
      titleInput.classList.remove("is-invalid");
    }

    // Author validation
    const authorInput = document.getElementById("blog-author");
    const authorError = document.getElementById("author-error");
    if (authorInput.value.trim() === "") {
      authorError.textContent = "Author is required.";
      authorInput.classList.add("is-invalid");
      isValid = false;
    } else {
      authorError.textContent = "";
      authorInput.classList.remove("is-invalid");
    }

    // Brief validation
    const briefInput = document.getElementById("blog-brief");
    const briefError = document.getElementById("brief-error");
    if (briefInput.value.trim() === "") {
      briefError.textContent = "Brief is required.";
      briefInput.classList.add("is-invalid");
      isValid = false;
    } else {
      briefError.textContent = "";
      briefInput.classList.remove("is-invalid");
    }

    // Content validation
    const contentInput = document.getElementById("blog-content");
    const contentError = document.getElementById("content-error");
    if (contentInput.value.trim() === "") {
      contentError.textContent = "Content is required.";
      contentInput.classList.add("is-invalid");
      isValid = false;
    } else {
      contentError.textContent = "";
      contentInput.classList.remove("is-invalid");
    }

    // Image validation
    const imageInput = document.getElementById("blog-image");
    const imageError = document.getElementById("image-error");
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
      const formData = new FormData(addBlogForm);

      fetch("/admin/blogs/add", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            location.reload(); // Reload the page to see the new blog
          } else {
            alert("Failed to add blog.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while adding the blog.");
        });
    }
  });
});
