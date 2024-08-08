const express = require("express");
const app = express();
const memberController = require("../controllers/memberController");
const dashboardController = require("../controllers/dashboardController");
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

module.exports = app;
