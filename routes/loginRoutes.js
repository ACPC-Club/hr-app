const express = require("express");
const app = express();
const loginController = require("../controllers/loginController");

app.get("/", (req, res) => {
  res.redirect("/");
});

app.post("/", loginController.loginProcess);

module.exports = app;
