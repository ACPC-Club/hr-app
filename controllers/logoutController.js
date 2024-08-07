const logoutProcess = (req, res) => {
  console.log("Logout request received");
  req.session.destroy();
  res.redirect("/");
};

module.exports = { logoutProcess };
