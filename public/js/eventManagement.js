document.addEventListener("DOMContentLoaded", () => {
  let searchQuery = "";
  let sortBy = "name"; // Default sort by event name
  let sortOrder = "asc"; // Default sort order ascending
  let currentPage = 1;
  let totalPages = 1;

  const eventTableBody = document.getElementById("event-table-body");
  const paginationControls = document.getElementById("pagination-controls");

  // Fetch events from the server
  const fetchEvents = (page = 1) => {
    $.ajax({
      url: "/admin/api/events",
      method: "GET",
      data: {
        page,
        search: searchQuery,
        sortBy,
        sortOrder,
      },
      success: (response) => {
        const { data, totalPages: total, currentPage: current } = response;
        eventTableBody.innerHTML = "";
        data.forEach((event) => {
          const row = `<tr>
              <td><img src="${event.image}" alt="${event.name}" class="img-thumbnail" width="100"></td>
              <td>${event.name}</td>
              <td>${event.duration} hours</td>
              <td>${event.time}</td>
              <td>${new Date(event.date).toLocaleDateString()}</td>
              <td>${event.description}</td>
              <td>${event.location}</td>
              <td>
                <div class="btn-group" role="group">
                  <a
                    href="#"
                    class="btn btn-outline-primary btn-sm edit-event-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#editEventModal"
                    data-event-id="${event._id}"
                    >Edit</a
                  >
                  <a
                    href="#"
                    class="btn btn-outline-info btn-sm view-event-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#viewEventModal"
                    data-event-id="${event._id}"
                    >View</a
                  >
                  <a
                    href="#"
                    class="btn btn-outline-danger btn-sm delete-event-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteEventModal"
                    data-event-id="${event._id}"
                    >Delete</a
                  >
                </div>
              </td>
            </tr>`;
          eventTableBody.insertAdjacentHTML("beforeend", row);
        });

        currentPage = current;
        totalPages = total;
        renderPagination();
      },
      error: (error) => {
        console.error("Error fetching events:", error);
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
          fetchEvents(page);
        }
      });
    }
  };

  // Search bar functionality
  document.getElementById("search-bar").addEventListener("input", () => {
    searchQuery = document.getElementById("search-bar").value.toLowerCase();
    fetchEvents(1);
  });

  // Sort form submission
  document.getElementById("sort-form").addEventListener("submit", (event) => {
    event.preventDefault();
    sortBy = document.getElementById("sort-by").value;
    sortOrder = document.getElementById("sort-order").value;
    fetchEvents(1);
    $("#sortModal").modal("hide");
  });

  // Initial fetch of events
  fetchEvents(1);
});
