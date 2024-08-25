const Event = require("../models/eventModel");
const path = require("path");
const fs = require("fs");

const getEvents = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterDate = "",
    sortBy = "date",
    sortOrder = "asc",
  } = req.query;

  console.log("Received GET request for events with query:", req.query);

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" }; // case-insensitive search
    console.log("Search query applied:", query.name);
  }
  if (filterDate) {
    query.date = { $gte: new Date(filterDate) };
    console.log("Date filter applied:", query.date);
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
  console.log("Sorting options:", sortOptions);

  try {
    const events = await Event.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Event.countDocuments(query);

    console.log("Fetched events:", events);
    console.log("Total events matching query:", total);

    res.status(200).json({
      success: true,
      data: events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addEvent = async (req, res) => {
  console.log("Received POST request to add event with body:", req.body);

  const {
    eventName,
    eventDate,
    eventDuration,
    eventTime,
    eventLocation,
    eventDescription,
  } = req.body;

  const imageFile = req.file;
  console.log("Uploaded file info:", imageFile);

  let errors = {};

  // Validation checks...

  if (Object.keys(errors).length > 0) {
    console.log("Validation errors found:", errors);
    return res.status(400).json({ success: false, errors });
  }

  try {
    // Move the file to the public/images directory and store the relative path
    const imagePath = `/images/${imageFile.filename}`;
    const targetPath = path.join(__dirname, "../public/images", imageFile.filename);

    fs.renameSync(imageFile.path, targetPath);

    const newEvent = new Event({
      name: eventName.trim(),
      date: new Date(`${eventDate}T${eventTime}`),
      image: imagePath, // Save only the relative path
      duration: eventDuration.trim(),
      time: eventTime.trim(),
      location: eventLocation.trim(),
      description: eventDescription.trim(),
    });

    console.log("Saving new event:", newEvent);

    await newEvent.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editEvent = async (req, res) => {
  console.log("Received PUT request to edit event with body:", req.body);

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
  console.log("Uploaded file info:", imageFile);

  let errors = {};

  // Validation checks...

  if (Object.keys(errors).length > 0) {
    console.log("Validation errors found:", errors);
    return res.status(400).json({ success: false, errors });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      console.log("Event not found with ID:", id);
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    event.name = eventName.trim();
    event.date = new Date(`${eventDate}T${eventTime}`);
    event.duration = eventDuration.trim();
    event.time = eventTime.trim();
    event.location = eventLocation.trim();
    event.description = eventDescription.trim();

    if (imageFile) {
      // Move the new file to the public/images directory and store the relative path
      const imagePath = `/images/${imageFile.filename}`;
      const targetPath = path.join(__dirname, "../public/images", imageFile.filename);

      fs.renameSync(imageFile.path, targetPath);

      event.image = imagePath;
    }

    console.log("Saving edited event:", event);

    await event.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error editing event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  console.log("Received DELETE request for event ID:", req.params.id);

  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      console.log("Event not found with ID:", req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    console.log("Deleted event:", event);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getEvents,
  addEvent,
  editEvent,
  deleteEvent,
};
