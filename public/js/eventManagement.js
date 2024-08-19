document.addEventListener("DOMContentLoaded", () => {
  // Handle the Export to Excel functionality
  document.getElementById("export-btn").addEventListener("click", () => {
    const table = document.querySelector("table");
    if (!table) {
      console.error("Table element not found");
      return;
    }
    const wb = XLSX.utils.table_to_book(table, { sheet: "Events" });
    XLSX.writeFile(wb, "events.xlsx");
  });

  // Elements
  const searchBar = document.getElementById("search-bar");
  const eventTableBody = document.getElementById("event-table-body");
  const paginationControls = document.getElementById("pagination-controls");

  // Variables
  let currentPage = 1;
  let totalPages = 1;
  let searchQuery = "";
  let sortBy = "date";
  let sortOrder = "asc";

  // Fetch events from the server
  const fetchEvents = (page = 1) => {
    $.ajax({
      url: "/api/events",
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
              <td><img src="${event.image}" alt="${event.name}" style="width: 100px; height: auto;" /></td>
              <td>${event.name}</td>
              <td>${event.duration}</td>
              <td>${event.time}</td>
              <td>${event.date.toLocaleString()}</td>
              <td>${event.description}</td>
              <td>${event.location}</td>
              <td>
                <div class="btn-group" role="group">
                  <a href="#" class="btn btn-outline-primary btn-sm edit-event-btn" data-bs-toggle="modal" data-bs-target="#editEvent" data-event-id="${event._id}">Edit</a>
                  <a href="#" class="btn btn-outline-info btn-sm view-event-btn" data-bs-toggle="modal" data-bs-target="#viewEvent" data-event-id="${event._id}">View</a>
                  <a href="#" class="btn btn-outline-danger btn-sm delete-event-btn" data-bs-toggle="modal" data-bs-target="#deleteEvent" data-event-id="${event._id}">Delete</a>
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
      const pageItem = `<li class="page-item ${i === currentPage ? "active" : ""}">
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
  searchBar.addEventListener("input", () => {
    searchQuery = searchBar.value.toLowerCase();
    fetchEvents(1);
  });

  // Initial fetch of events
  fetchEvents(1);
});
