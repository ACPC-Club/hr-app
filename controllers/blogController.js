const blogModel = require("../models/blogModel");

const blogList = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res.render("blogs", { blogs, layout: false });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
const addBlog = async (req, res) => {
  try {
    const newBlog = new blogModel(req.body);
    await newBlog.save();
    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = { blogList, addBlog };
