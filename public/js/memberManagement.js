document.addEventListener("DOMContentLoaded", () => {
  // Handle the Export to Excel functionality
  document.getElementById("export-btn").addEventListener("click", () => {
    console.log("Exporting to Excel");
    const table = document.querySelector("table");
    if (!table) {
      console.error("Table element not found");
      return;
    }
    const wb = XLSX.utils.table_to_book(table, { sheet: "Users" });
    XLSX.writeFile(wb, "users.xlsx");
    console.log("Exported to Excel");
  });

  // Elements
  const searchBar = document.getElementById("search-bar");
  const memberTableBody = document.getElementById("member-table-body");
  const filterForm = document.getElementById("filter-form");
  const sortForm = document.getElementById("sort-form");
  const paginationControls = document.getElementById("pagination-controls");

  // Variables
  let currentPage = 1;
  let totalPages = 1;
  let searchQuery = "";
  let filterDepartment = "";
  let filterYear = "";
  let sortBy = "name";
  let sortOrder = "asc";

  // Fetch members from the server
  const fetchMembers = (page = 1) => {
    $.ajax({
      url: "/admin/api/members",
      method: "GET",
      data: {
        page,
        search: searchQuery,
        filterDepartment,
        filterYear,
        sortBy,
        sortOrder,
      },
      success: (response) => {
        const { data, totalPages: total, currentPage: current } = response;
        memberTableBody.innerHTML = "";
        data.forEach((member) => {
          const row = `<tr>
              <td>${member.name}</td>
              <td><a href="tel:${member.phoneNumber}">${
            member.phoneNumber
          }</a></td>
              <td>${member.universityId}</td>
              <td>${member.department}</td>
              <td>${member.year}</td>
              <td>${member.points}</td>
              <td>${member.warnings.length}</td>
              <td>${member.isBoardMember ? "Yes" : "No"}</td>
              <td>
                <div class="btn-group" role="group">
                  <a
                    href="#"
                    class="btn btn-outline-primary btn-sm edit-user-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#editMember"
                    data-user-id="${member._id}"
                    >Edit</a
                  >
                  <a
                    href="#"
                    class="btn btn-outline-info btn-sm view-user-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#viewMember"
                    data-user-id="${member._id}"
                    >View</a
                  >
                  <a
                    href="#"
                    class="btn btn-outline-danger btn-sm delete-user-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteConfirmation"
                    data-user-id="${member._id}"
                    >Delete</a
                  >
                </div>
              </td>
            </tr>`;
          memberTableBody.insertAdjacentHTML("beforeend", row);
        });

        currentPage = current;
        totalPages = total;
        renderPagination();
      },
      error: (error) => {
        console.error("Error fetching members:", error);
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
          fetchMembers(page);
        }
      });
    }
  };

  // Search bar functionality
  searchBar.addEventListener("input", () => {
    searchQuery = searchBar.value.toLowerCase();
    fetchMembers(1);
  });

  // Filter form submission
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterDepartment = document.getElementById("filter-department").value;
    filterYear = document.getElementById("filter-year").value;
    fetchMembers(1);
    $("#filterModal").modal("hide");
  });

  // Sort form submission
  sortForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sortBy = document.getElementById("sort-by").value;
    sortOrder = document.getElementById("sort-order").value;
    fetchMembers(1);
    $("#sortModal").modal("hide");
  });

  // Initial fetch of members
  fetchMembers(1);

  // Handle the click event for view buttons
  memberTableBody.addEventListener("click", async (event) => {
    if (event.target.classList.contains("view-user-btn")) {
      event.preventDefault();
      const userId = event.target.getAttribute("data-user-id");
      try {
        const response = await fetch(`/admin/api/members/${userId}`);
        const user = await response.json();
        if (user) {
          // Populate the modal fields
          document.getElementById("view-member-name").textContent = user.name;
          document.getElementById("view-member-phone").textContent =
            user.phoneNumber;
          document.getElementById("view-member-universityId").textContent =
            user.universityId;
          document.getElementById("view-member-department").textContent =
            user.department;
          document.getElementById("view-member-year").textContent = user.year;
          document.getElementById("view-member-points").textContent =
            user.points;
          document.getElementById("view-member-warnings").textContent =
            user.warnings.join(", ");
          document.getElementById("view-member-boardMember").textContent =
            user.isBoardMember ? "Yes" : "No";

          // Generate and display the QR code
          const qrContainer = document.getElementById("view-member-qr");
          qrContainer.innerHTML = ""; // Clear previous QR code
          new QRCode(qrContainer, {
            text: user._id,
            width: 128,
            height: 128,
          });

          // Set the href for the "View on Separate Page" button
          document.getElementById(
            "view-on-page-btn"
          ).href = `/admin/members/view/${user._id}`;
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  });
});
