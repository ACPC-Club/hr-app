// Import your routes here...
const indexRoutes = require("./indexRoutes");
const loginRoutes = require("./loginRoutes");
const logoutRoutes = require("./logoutRoutes");
const adminRoutes = require("./adminRoutes");
function setupRoutes(app) {
  app.use((req, res, next) => {
    res.locals.user = req.session.user === undefined ? "" : req.session.user;
    next();
  });
  // Initialize your routes here...
  app.use("/", indexRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/admin", adminRoutes);

  // set up 404

  app.use((req, res) => {
    res.render("404", {
      currentPage: "404",
    });
  });
}

module.exports = { setupRoutes };
