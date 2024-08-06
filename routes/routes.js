// Import your routes here...
const indexRoutes = require("./indexRoutes");

function setupRoutes(app) {
  // Initialize your routes here...
  app.use("/", indexRoutes);

  // set up 404

  app.use((req, res) => {
    res.render("404", {
      currentPage: "404",
      user: req.session.user === undefined ? "" : req.session.user,
    });
  });
}

module.exports = { setupRoutes };
