$(document).ready(function () {
  function fetchEvents(params = {}) {
    $.ajax({
      url: "/admin/api/events",
      data: params,
      success: function (response) {
        if (response.success) {
          renderEvents(response.data);
          renderPagination(response.currentPage, response.totalPages);
        } else {
          alert("Failed to fetch events.");
        }
      },
      error: function () {
        alert("Error occurred while fetching events.");
      },
    });
  }

  function renderEvents(events) {
    let eventList = $("#eventList");
    eventList.empty();
    events.forEach((event) => {
      eventList.append(`
        <tr>
          <td><img src="/${event.image}" alt="${event.name}" style="width: 100px; height: auto;"></td>
          <td>${event.name}</td>
          <td>${event.description}</td>
          <td>${new Date(event.date).toLocaleString()}</td>
          <td>
            <button class="btn btn-primary edit-btn" data-id="${event._id}">Edit</button>
            <button class="btn btn-danger delete-btn" data-id="${event._id}">Delete</button>
          </td>
        </tr>
      `);
    });
    attachEventHandlers();
  }

  function renderPagination(currentPage, totalPages) {
    let pagination = $("#pagination");
    pagination.empty();
    for (let i = 1; i <= totalPages; i++) {
      pagination.append(`
        <button class="btn btn-secondary page-btn" data-page="${i}">${i}</button>
      `);
    }
    attachPaginationHandlers();
  }

  function attachEventHandlers() {
    $(".edit-btn").click(function () {
      let id = $(this).data("id");
      $.ajax({
        url: `/admin/api/events/${id}`,
        success: function (response) {
          if (response.success) {
            let event = response.data;
            $("#eventId").val(event._id);
            $("#eventName").val(event.name);
            $("#eventDate").val(event.date.split("T")[0]);
            $("#eventTime").val(event.date.split("T")[1].slice(0, 5));
            $("#eventDuration").val(event.duration);
            $("#eventLocation").val(event.location);
            $("#eventDescription").val(event.description);
            $("#eventModalLabel").text("Edit Event");
            $("#eventModal").modal("show");
          } else {
            alert("Failed to fetch event details.");
          }
        },
        error: function () {
          alert("Error occurred while fetching event details.");
        },
      });
    });

    $(".delete-btn").click(function () {
      let id = $(this).data("id");
      if (confirm("Are you sure you want to delete this event?")) {
        $.ajax({
          url: `/admin/deleteEvent/${id}`,
          method: "DELETE",
          success: function (response) {
            if (response.success) {
              fetchEvents();
            } else {
              alert("Failed to delete event.");
            }
          },
          error: function () {
            alert("Error occurred while deleting event.");
          },
        });
      }
    });
  }

  function attachPaginationHandlers() {
    $(".page-btn").click(function () {
      let page = $(this).data("page");
      fetchEvents({ page });
    });
  }

  $("#searchForm").submit(function (e) {
    e.preventDefault();
    let search = $("#search").val();
    let filterDate = $("#filterDate").val();
    fetchEvents({ search, filterDate });
  });

  $("#addEventBtn").click(function () {
    $("#eventForm")[0].reset();
    $("#eventId").val("");
    $(".error-message").text("");
    $("#eventModalLabel").text("Add Event");
    $("#eventModal").modal("show");
  });

  $("#eventForm").submit(function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    let id = $("#eventId").val();
    let url = id ? `/admin/editEvent/${id}` : "/admin/addEvent";
    $.ajax({
      url,
      method: id ? "PUT" : "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.success) {
          $("#eventModal").modal("hide");
          fetchEvents();
        } else {
          for (let key in response.errors) {
            $(`#${key}Error`).text(response.errors[key]);
          }
        }
      },
      error: function () {
        alert("Error occurred while saving event.");
      },
    });
  });

  fetchEvents();
});
