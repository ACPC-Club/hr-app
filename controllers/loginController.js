const bcrypt = require("bcrypt");
const userModel = require("../models/userModel.js");

const loginProcess = async (req, res) => {
  console.log("Login request received");
  const { username, password } = req.body;

  const errors = [];

  if (!username) {
    errors.push({ message: "Please enter your username" });
  }
  if (!password) {
    errors.push({ message: "Please enter your password" });
  }
  if (errors.length > 0) {
    return res.render("index", { errors, username, password });
  }
  try {
    const user = await userModel.findOne({ username });

    if (user) {
      const valid = await bcrypt.compare(password, user.password);

      if (valid) {
        req.session.user = user;
        return res.redirect("/admin");
      } else {
        errors.push({ message: "Incorrect password" });
        return res.render("index", { errors, username });
      }
    } else {
      errors.push({ message: "Username not found" });
      return res.render("index", { errors, username });
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

module.exports = { loginProcess };
