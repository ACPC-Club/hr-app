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

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" }; // case-insensitive search
  }
  if (filterDate) {
    query.date = { $gte: new Date(filterDate) };
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

  try {
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Event.countDocuments(query);

    console.log("Fetched events:", events); // Debugging

    res.status(200).json({
      success: true,
      data: events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching events:", error); // Debugging
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
    eventDescription,
  } = req.body;

  const imageFile = req.file;

  let errors = {};

  if (!eventName || eventName.trim() === "") {
    errors.eventName = "Event name is required.";
  }

  if (!eventDate) {
    errors.eventDate = "Event date is required.";
  } else if (new Date(eventDate) < new Date()) {
    errors.eventDate = "Event date cannot be in the past.";
  }

  if (!eventTime) {
    errors.eventTime = "Event time is required.";
  } else if (new Date(`${eventDate}T${eventTime}`) < new Date()) {
    errors.eventTime = "Event time cannot be in the past.";
  }

  if (!eventDuration || eventDuration.trim() === "") {
    errors.eventDuration = "Event duration is required.";
  }

  if (!eventLocation || eventLocation.trim() === "") {
    errors.eventLocation = "Event location is required.";
  }

  if (!eventDescription || eventDescription.trim() === "") {
    errors.eventDescription = "Event description is required.";
  }

  if (!imageFile) {
    errors.eventImage = "Event image is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const newEvent = new Event({
      name: eventName.trim(),
      date: new Date(`${eventDate}T${eventTime}`),
      image: imageFile.path,
      duration: eventDuration.trim(),
      time: eventTime.trim(),
      location: eventLocation.trim(),
      description: eventDescription.trim(),
    });

    await newEvent.save();
    res.status(200).json({ success: true });
  } catch (error) {
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
    eventDescription,
  } = req.body;

  const imageFile = req.file;

  let errors = {};

  if (!eventName || eventName.trim() === "") {
    errors.eventName = "Event name is required.";
  }

  if (!eventDate) {
    errors.eventDate = "Event date is required.";
  } else if (new Date(eventDate) < new Date()) {
    errors.eventDate = "Event date cannot be in the past.";
  }

  if (!eventTime) {
    errors.eventTime = "Event time is required.";
  } else if (new Date(`${eventDate}T${eventTime}`) < new Date()) {
    errors.eventTime = "Event time cannot be in the past.";
  }

  if (!eventDuration || eventDuration.trim() === "") {
    errors.eventDuration = "Event duration is required.";
  }

  if (!eventLocation || eventLocation.trim() === "") {
    errors.eventLocation = "Event location is required.";
  }

  if (!eventDescription || eventDescription.trim() === "") {
    errors.eventDescription = "Event description is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    event.name = eventName.trim();
    event.date = new Date(`${eventDate}T${eventTime}`);
    event.duration = eventDuration.trim();
    event.time = eventTime.trim();
    event.location = eventLocation.trim();
    event.description = eventDescription.trim();

    if (imageFile) {
      event.image = imageFile.path;
    }

    await event.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getEvents,
  addEvent,
  editEvent,
  deleteEvent,
};
