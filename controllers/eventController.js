const Event = require("../models/eventModel");
const path = require("path");

const getEvents = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterDate = "",
    sortBy = "date",
    sortOrder = "asc",
  } = req.query;

  console.log("Request Query:", req.query);

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" }; // case-insensitive search
  }
  if (filterDate) {
    query.date = { $gte: new Date(filterDate) }; // Example filter for date
  }

  console.log("Query Object:", query);

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  console.log("Sort Options:", sortOptions);

  try {
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Event.countDocuments(query);

    console.log("Events Fetched:", events);
    console.log("Total Events:", total);

    res.status(200).json({
      success: true,
      data: events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error Fetching Events:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const addEvent = async (req, res) => {
  const {
    eventName,
    eventDate,
    eventDuration,
    eventTime,
    eventLocation,
    eventDescription, // Added description
  } = req.body;

  const imageFile = req.file; // Assuming you use multer middleware

  console.log("Request Body:", req.body);
  console.log("Image File:", req.file);

  let errors = {};

  // Server-side validation
  if (!eventName || eventName.trim() === "") {
    errors.eventName = "Event name is required.";
  }

  if (!eventDate) {
    errors.eventDate = "Event date is required.";
  }

  if (!eventDuration || eventDuration.trim() === "") {
    errors.eventDuration = "Event duration is required.";
  }

  if (!eventTime || eventTime.trim() === "") {
    errors.eventTime = "Event time is required.";
  }

  if (!eventLocation || eventLocation.trim() === "") {
    errors.eventLocation = "Event location is required.";
  }

  if (!eventDescription || eventDescription.trim() === "") { // Added description validation
    errors.eventDescription = "Event description is required.";
  }

  if (!imageFile) {
    errors.eventImage = "Event image is required.";
  }

  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
    return res.status(400).json({ success: false, errors });
  }

  try {
    const newEvent = new Event({
      name: eventName.trim(),
      date: new Date(eventDate),
      image: imageFile.path, // Store the path of the uploaded image
      duration: eventDuration.trim(),
      time: eventTime.trim(),
      location: eventLocation.trim(),
      description: eventDescription.trim(), // Added description
    });

    await newEvent.save();
    console.log("New Event Saved:", newEvent);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error Saving Event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editEvent = async (req, res) => {
  const {
    id,
    eventName,
    eventDate,
    eventDuration,
    eventTime,
    eventLocation,
    eventDescription, // Added description
  } = req.body;

  const imageFile = req.file;

  console.log("Request Body:", req.body);
  console.log("Image File:", req.file);

  let errors = {};

  // Server-side validation
  if (!id) {
    errors.eventId = "Event ID is required.";
  }

  if (!eventName || eventName.trim() === "") {
    errors.eventName = "Event name is required.";
  }

  if (!eventDate) {
    errors.eventDate = "Event date is required.";
  }

  if (!eventDuration || eventDuration.trim() === "") {
    errors.eventDuration = "Event duration is required.";
  }

  if (!eventTime || eventTime.trim() === "") {
    errors.eventTime = "Event time is required.";
  }

  if (!eventLocation || eventLocation.trim() === "") {
    errors.eventLocation = "Event location is required.";
  }

  if (!eventDescription || eventDescription.trim() === "") { // Added description validation
    errors.eventDescription = "Event description is required.";
  }

  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
    return res.status(400).json({ success: false, errors });
  }

  try {
    const updateFields = {
      name: eventName.trim(),
      date: new Date(eventDate),
      duration: eventDuration.trim(),
      time: eventTime.trim(),
      location: eventLocation.trim(),
      description: eventDescription.trim(), // Added description
    };

    if (imageFile) {
      updateFields.image = imageFile.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    console.log("Event Updated:", updatedEvent);
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error Updating Event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  console.log("Deleting Event ID:", id);

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    console.log("Event Deleted:", deletedEvent);
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getEvents, addEvent, editEvent, deleteEvent };
