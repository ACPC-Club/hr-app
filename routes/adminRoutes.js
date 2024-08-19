const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const dashboardController = require("../controllers/dashboardController");
const blogController = require("../controllers/blogController");
const eventController = require("../controllers/eventController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// View member details page
router.get("/members/view/:id", memberController.viewMember);

// Middleware to check if user is logged in
router.use((req, res, next) => {
  if (req.session.user !== undefined) {
    next();
  } else {
    res.render("404", {
      currentPage: "404",
    });
  }
});

router.get("/", (req, res) => {
  res.render("dashboard", { layout: false });
});

router.get("/api/dashboard", dashboardController.getStatistics);

router.get("/members", (req, res) => {
  res.render("members", { layout: false });
});

router.get("/blogs", blogController.blogList);

router.get("/events", (req, res) => {
  res.render("events");
});

// Route to fetch member data
router.get("/api/members", memberController.getMembers);

// Route to fetch a single member by ID
router.get("/api/members/:id", memberController.getMemberById);

// Route to add a new member
router.post("/addMember", memberController.addMember);

// Route to edit a member
router.post("/editMember", memberController.editMember);

// Route to delete a member
router.delete("/deleteMember/:id", memberController.deleteMember);

// Route to fetch event data
router.get("/api/events", eventController.getEvents);

// Route to add a new event
router.post("/addEvent", upload.single("imageFile"), eventController.addEvent);

// Route to edit an event
router.post("/editEvent", upload.single("imageFile"), eventController.editEvent);

// Route to delete an event
router.delete("/deleteEvent/:id", eventController.deleteEvent);

module.exports = router;
