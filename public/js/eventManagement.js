document.addEventListener("DOMContentLoaded", () => {
  let searchQuery = "";
  let sortBy = "name"; // Default sort by event name
  let sortOrder = "asc"; // Default sort order ascending

  const eventTableBody = document.getElementById("event-table-body");

  // Function to fetch events
  window.fetchEvents = (page = 1) => {
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
        if (!data || !Array.isArray(data)) return;

        eventTableBody.innerHTML = "";

        data.forEach((event) => {
          const row = `
            <tr>
              <td><img src="${event.image}" alt="${event.name}" style="width: 100px; height: auto;" /></td>
              <td>${event.name}</td>
              <td>${event.duration}</td>
              <td>${event.time}</td>
              <td>${new Date(event.date).toLocaleDateString()}</td>
              <td class="description-cell">${event.description}</td>
              <td>${event.location}</td>
              <td>
                <div class="btn-group" role="group">
                  <a href="#" class="btn btn-outline-primary btn-sm edit-event-btn" data-bs-toggle="modal" data-bs-target="#editEvent" data-event-id="${event._id}">Edit</a>
                  <a href="#" class="btn btn-outline-info btn-sm view-event-btn" data-bs-toggle="modal" data-bs-target="#viewEvent" data-event-id="${event._id}">View</a>
                  <a href="#" class="btn btn-outline-danger btn-sm delete-event-btn" data-bs-toggle="modal" data-bs-target="#deleteEvent" data-event-id="${event._id}">Delete</a>
                </div>
              </td>
            </tr>
          `;
          eventTableBody.insertAdjacentHTML("beforeend", row);
        });

        currentPage = current;
        totalPages = total;
        renderPagination(currentPage, totalPages);
      },
      error: (error) => {
        console.error("Error fetching events:", error);
        alert("An error occurred while fetching events. Check the console for details.");
      },
    });
  };

  // RenderPagination function
  function renderPagination(currentPage, totalPages) {
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = ""; // Clear existing pagination

    for (let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = page;
      pageButton.classList.add("btn", "btn-secondary", "mx-1");

      if (page === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        fetchEvents(page);
      });

      paginationElement.appendChild(pageButton);
    }
  }

  // RenderPagination function
  function renderPagination(currentPage, totalPages) {
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = ""; // Clear existing pagination

    for (let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = page;
      pageButton.classList.add("btn", "btn-secondary", "mx-1");

      if (page === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        fetchEvents(page);
      });

      paginationElement.appendChild(pageButton);
    }
  }

  // Event listeners
  document.getElementById("apply-sort").addEventListener("click", () => {
    sortBy = document.getElementById("sort-by").value;
    sortOrder = document.getElementById("sort-order").value;
    fetchEvents(1); // Fetch events again with new sort options
    $('#sortModal').modal('hide'); // Close the modal after applying sort
  });

  // Initialize the first fetch
  fetchEvents(1);
});
