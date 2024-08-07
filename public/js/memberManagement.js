document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const memberTableBody = document.getElementById("member-table-body");
  const filterForm = document.getElementById("filter-form");
  const sortForm = document.getElementById("sort-form");
  const paginationControls = document.getElementById("pagination-controls");

  let currentPage = 1;
  let totalPages = 1;
  let searchQuery = "";
  let filterDepartment = "";
  let filterYear = "";
  let sortBy = "name";
  let sortOrder = "asc";

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
              <td>${member._id}</td>
              <td>${member.name}</td>
              <td>${member.phoneNumber}</td>
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
                    data-bs-target="#editUser"
                    data-user-id="${member._id}"
                    >Edit</a
                  >
                  <a
                    href="/admin/users/view/${member._id}"
                    class="btn btn-outline-info btn-sm"
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

  searchBar.addEventListener("input", function () {
    searchQuery = searchBar.value.toLowerCase();
    fetchMembers(1);
  });

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    filterDepartment = document.getElementById("filter-department").value;
    filterYear = document.getElementById("filter-year").value;
    fetchMembers(1);
    $("#filterModal").modal("hide");
  });

  sortForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sortBy = document.getElementById("sort-by").value;
    sortOrder = document.getElementById("sort-order").value;
    fetchMembers(1);
    $("#sortModal").modal("hide");
  });

  fetchMembers(1);
});
