const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const favicon = require("serve-favicon");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const { connectToMongoDB } = require("./config/mongo.js");
const { setupRoutes } = require("./routes/routes.js");
const app = express();
// Serve static files
app.use(express.static("public", { maxAge: "7d" }));

// Serve favicon
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set view engine
app.set("view engine", "ejs");

// Method override middleware
app.use(methodOverride("_method"));

// Express layouts middleware
app.use(expressLayouts);

// Connect to MongoDB
connectToMongoDB();

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// userModel.create({
//   username: "admin",
//   password: bcrypt.hashSync("supersecret123", 10),
//   role: "admin",
// });

// Setup routes
setupRoutes(app);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
