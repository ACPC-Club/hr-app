document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const eventTableBody = document.getElementById("event-table-body");
    const filterForm = document.getElementById("filter-form");
    const sortForm = document.getElementById("sort-form");
    const paginationControls = document.getElementById("pagination-controls");
  
    let currentPage = 1;
    let totalPages = 1;
    let searchQuery = "";
    let filterDate = "";
    let sortBy = "eventName";
    let sortOrder = "asc";
  
    const fetchEvents = (page = 1) => {
      $.ajax({
        url: "/admin/api/events",
        method: "GET",
        data: {
          page,
          search: searchQuery,
          filterDate,
          sortBy,
          sortOrder,
        },
        success: (response) => {
          const { data, totalPages: total, currentPage: current } = response;
          eventTableBody.innerHTML = "";
          data.forEach((event) => {
            const row = `<tr>
                <td><img src="${event.imageUrl}" alt="${event.eventName}" width="50" height="50"></td>
                <td>${event.eventName}</td>
                <td>${event.eventDuration}</td>
                <td>${event.eventTime}</td>
                <td>${event.eventDate}</td>
                <td>${event.description}</td>
                <td>${event.location}</td>
                <td>
                  <div class="btn-group" role="group">
                    <a
                      href="#"
                      class="btn btn-outline-primary btn-sm edit-event-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#editEvent"
                      data-event-id="${event._id}"
                      >Edit</a
                    >
                    <a
                      href="#"
                      class="btn btn-outline-info btn-sm view-event-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#viewEvent"
                      data-event-id="${event._id}"
                      >View</a
                    >
                    <a
                      href="#"
                      class="btn btn-outline-danger btn-sm delete-event-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteConfirmation"
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
  
    searchBar.addEventListener("input", function () {
      searchQuery = searchBar.value.toLowerCase();
      fetchEvents(1);
    });
  
    filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      filterDate = document.getElementById("filter-date").value;
      fetchEvents(1);
      $("#filterModal").modal("hide");
    });
  
    sortForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sortBy = document.getElementById("sort-by").value;
      sortOrder = document.getElementById("sort-order").value;
      fetchEvents(1);
      $("#sortModal").modal("hide");
    });
  
    fetchEvents(1);
  
    // Handle the click event for view buttons
    eventTableBody.addEventListener("click", async (event) => {
      if (event.target.classList.contains("view-event-btn")) {
        event.preventDefault();
        const eventId = event.target.getAttribute("data-event-id");
        try {
          const response = await fetch(`/admin/api/events/${eventId}`);
          const event = await response.json();
          if (event) {
            // Populate the modal fields
            document.getElementById("view-event-name").textContent =
              event.eventName;
            document.getElementById("view-event-date").textContent =
              event.eventDate;
            document.getElementById("view-event-time").textContent =
              event.eventTime;
            document.getElementById("view-event-duration").textContent =
              event.eventDuration;
            document.getElementById("view-event-description").textContent =
              event.description;
            document.getElementById("view-event-location").textContent =
              event.location;
            document.getElementById("view-event-image").src =
              event.imageUrl;
  
            // Set the href for the "View on Separate Page" button
            document.getElementById(
              "view-on-page-btn"
            ).href = `/admin/events/view/${event._id}`;
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      }
    });
  });
  