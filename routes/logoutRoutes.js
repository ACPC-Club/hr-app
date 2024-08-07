const express = require("express");
const app = express();
const logoutController = require("../controllers/logoutController");

app.post("/", logoutController.logoutProcess);

module.exports = app;
