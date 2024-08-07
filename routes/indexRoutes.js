const express = require("express");
const app = express();
const loginController = require("../controllers/loginController");

app.get("/", (req, res) => {
  res.render("index", {
    currentPage: "home",
  });
});

module.exports = app;