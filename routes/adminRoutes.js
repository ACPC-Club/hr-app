const express = require("express");
const app = express();
const memberController = require("../controllers/memberController");
const dashboardController = require("../controllers/dashboardController");
const blogController = require("../controllers/blogController");
const eventController = require("../controllers/eventController");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Specify the directory to save the file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file
  },
});

const upload = multer({ storage: storage });

// View member details page
app.get("/members/view/:id", memberController.viewMember);

// Middleware to check if user is logged in
app.use((req, res, next) => {
  if (req.session.user !== undefined) {
    next();
  } else {
    res.render("404", {
      currentPage: "404",
    });
  }
});

app.get("/", (req, res) => {
  res.render("dashboard", { layout: false });
});

app.get("/api/dashboard", dashboardController.getStatistics);


app.get("/members", (req, res) => {
  res.render("members", { layout: false }); // Assumes you have a 'members.ejs' file in your 'views' directory
});

app.get("/blogs", blogController.blogList); // Assumes you have a 'blogs.ejs' file in your 'views' directory

app.get("/events", (req, res) => {
  res.render("events"); // Assumes you have a 'events.ejs' file in your 'views' directory
});

// Route to fetch member data
app.get("/api/members", memberController.getMembers);

// Route to fetch a single member by ID
app.get("/api/members/:id", memberController.getMemberById);

// Route to add a new member
app.post("/addMember", memberController.addMember);

// Route to edit a member
app.post("/editMember", memberController.editMember);

// Route to delete a member
app.delete("/deleteMember/:id", memberController.deleteMember);

// Route to fetch event data
app.get("/api/events", eventController.getEvents);

// Route to add a new event
app.post("/addEvent", upload.single('imageFile'), eventController.addEvent);

// Route to edit an event
app.put("/editEvent", upload.single('imageFile'), eventController.editEvent); // Added edit route

// Route to delete an event
app.delete("/deleteEvent/:id", eventController.deleteEvent); // Added delete route

module.exports = app;
