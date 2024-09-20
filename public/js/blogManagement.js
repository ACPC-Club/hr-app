document.addEventListener("DOMContentLoaded", () => {
  // Handle the Export to Excel functionality
  document.getElementById("export-btn").addEventListener("click", () => {
    console.log("Exporting to Excel");
    const table = document.querySelector("table");
    if (!table) {
      console.error("Table element not found");
      return;
    }
    const wb = XLSX.utils.table_to_book(table, { sheet: "Blogs" });
    XLSX.writeFile(wb, "blogs.xlsx");
    console.log("Exported to Excel");
  });

  // Elements
  const searchBar = document.getElementById("search-bar");
  const blogTableBody = document.getElementById("blog-table-body");
  const filterForm = document.getElementById("filter-form");
  const sortForm = document.getElementById("sort-form");
  const paginationControls = document.getElementById("pagination-controls");

  // Variables
  let currentPage = 1;
  let totalPages = 1;
  let searchQuery = "";
  let filterAuthor = "";
  let sortBy = "date";
  let sortOrder = "desc";

  // Fetch blogs from the server
  const fetchBlogs = (page = 1) => {
    $.ajax({
      url: "/admin/api/blogs",
      method: "GET",
      data: {
        page,
        search: searchQuery,
        filterAuthor,
        sortBy,
        sortOrder,
      },
      success: (response) => {
        const { data, totalPages: total, currentPage: current } = response;
        blogTableBody.innerHTML = "";
        data.forEach((blog) => {
          const row = `<tr>
            <td>${blog.title}</td>
            <td>${blog.author}</td>
            <td>${blog.brief}</td>
            <td>${new Date(blog.date).toDateString()}</td>
            <td>
              <div class="btn-group" role="group">
                <a
                  href="#"
                  class="btn btn-outline-primary btn-sm edit-blog-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#editBlogModal${blog._id}"
                  data-blog-id="${blog._id}">
                  Edit</a>
                <a
                  href="#"
                  class="btn btn-outline-info btn-sm view-blog-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#viewBlogModal${blog._id}"
                  data-blog-id="${blog._id}">View</a>
                <form action="/admin/blogs/delete/${blog._id}" method="POST" class="d-inline">
                  <button type="submit" class="btn btn-outline-danger btn-sm delete-blog-btn">Delete</button>
                </form>
              </div>
            </td>
          </tr>`;
          blogTableBody.insertAdjacentHTML("beforeend", row);
        });

        currentPage = current;
        totalPages = total;
        renderPagination();
      },
      error: (error) => {
        console.error("Error fetching blogs:", error);
      },
    });
  };

  // Render pagination controls
  const renderPagination = () => {
    paginationControls.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageItem = `<li class="page-item ${
        i === currentPage ? "active" : ""
      }">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>`;
      paginationControls.insertAdjacentHTML("beforeend", pageItem);
    }

    const pageLinks = paginationControls.getElementsByClassName("page-link");
    for (let link of pageLinks) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const page = parseInt(event.target.getAttribute("data-page"));
        if (page !== currentPage) {
          fetchBlogs(page);
        }
      });
    }
  };

  // Search bar functionality
  searchBar.addEventListener("input", () => {
    searchQuery = searchBar.value.toLowerCase();
    fetchBlogs(1);
  });

  // Filter form submission
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterAuthor = document.getElementById("filter-author").value;
    fetchBlogs(1);
    $("#filterModal").modal("hide");
  });

  // Sort form submission
  sortForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sortBy = document.getElementById("sort-by").value;
    sortOrder = document.getElementById("sort-order").value;
    fetchBlogs(1);
    $("#sortModal").modal("hide");
  });

  // Initial fetch of blogs
  fetchBlogs(1);

  // Handle the click event for edit buttons
  
   


  // Handle the click event for view buttons
  blogTableBody.addEventListener("click", async (event) => {
    
    if (event.target.classList.contains("view-blog-btn")) {
      event.preventDefault();
      const blogId = event.target.getAttribute("data-blog-id");

      try {
        const response = await fetch(`/admin/api/blogs/${blogId}`);
        const blog = await response.json();

        if (blog) {
          // Populate the modal fields
          document.getElementById("view-blog-title").textContent = blog.title;
          document.getElementById("view-blog-author").textContent = blog.author;
          document.getElementById("view-blog-brief").textContent = blog.brief;
          document.getElementById("view-blog-date").textContent = blog.date;

          // Set the href for the "View on Separate Page" button
          document.getElementById("view-on-page-btn").href = `/admin/blogs/view/${blog._id}`;

          // Now open the modal for the corresponding blog
          const modal = new bootstrap.Modal(document.getElementById(`viewBlogModal${blog._id}`));
          modal.show();
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    }
  });
});
