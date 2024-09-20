const fs = require('fs');
const path = require('path');
const Blog = require('../models/blogModel'); // Assuming you have a Blog model

// Add Blog Controller (similar to Event)
const blogList = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("blogs", { blogs, layout: false });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
const addBlog = async (req, res) => {
  try {
    const { title, author, content, brief } = req.body;
    const image = req.file;

    // Validate the required fields
    if (!title || !author || !content || !brief || !image) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Create a new blog entry
    const newBlog = new Blog({
      title,
      author,
      content,
      brief,
      image: '/images/' + image.filename,
    });

    await newBlog.save();

    // Respond with a success message in JSON format
    res.status(200).json({ success: true, message: "Blog added successfully!" });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


module.exports = {  blogList,
  addBlog };
