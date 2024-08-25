document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  let searchQuery = "";
  let sortBy = "name"; // Default sort by event name
  let sortOrder = "asc"; // Default sort order ascending

  const eventTableBody = document.getElementById("event-table-body");

  // Function to fetch events
  const fetchEvents = (page = 1) => {
    console.log(
      `Fetching events for page ${page} with searchQuery: "${searchQuery}", sortBy: "${sortBy}", sortOrder: "${sortOrder}"`
    );

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
        console.log("API response:", response);

        const { data, totalPages: total, currentPage: current } = response;
        if (!data || !Array.isArray(data)) {
          console.error("Data is not an array or is missing:", data);
          return;
        }

        eventTableBody.innerHTML = "";

        data.forEach((event) => {
          console.log("Processing event:", event);

          // Update the row HTML in eventManagement.js
const row = `<tr>
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
</tr>`;

          eventTableBody.insertAdjacentHTML("beforeend", row);
        });

        currentPage = current;
        totalPages = total;
        renderPagination();
      },
      error: (error) => {
        console.error("Error fetching events:", error);
        alert(
          "An error occurred while fetching events. Check the console for details."
        );
      },
    });
  };

  // Event listeners for search, sort, and filter functionalities

  // // Search bar input event listener
  // document.getElementById("search-bar").addEventListener("input", (e) => {
  //   searchQuery = e.target.value.trim();
  //   fetchEvents(1); // Fetch events from page 1 with the new search query
  // });

  // // Example: Sort by name and sort order (asc/desc)
  // document.getElementById("sortModal").addEventListener("change", (e) => {
  //   const target = e.target;
  //   if (target.id === "sortBy") {
  //     sortBy = target.value;
  //   } else if (target.id === "sortOrder") {
  //     sortOrder = target.value;
  //   }
  //   fetchEvents(1); // Fetch events from page 1 with the new sort options
  // });

  // Initialize the first fetch
  fetchEvents(1);
});
