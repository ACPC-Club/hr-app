const express = require("express");
const app = express();
const memberController = require("../controllers/memberController");

app.get("/", (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});
app.get("/members", (req, res) => {
  res.render("members"); // Assumes you have a 'members.ejs' file in your 'views' directory
});
// Route to fetch member data
app.get("/api/members", memberController.getMembers);
app.post("/addMember", memberController.addMember);

module.exports = app;
