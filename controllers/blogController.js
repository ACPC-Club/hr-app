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

const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Set the limit of blogs per page
    const searchQuery = req.query.search || '';
    const filterAuthor = req.query.filterAuthor || '';
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build the query
    const query = {
      title: { $regex: searchQuery, $options: 'i' }, // Search by title (case insensitive)
    };

    if (filterAuthor) {
      query.author = filterAuthor; // Filter by author if provided
    }

    // Count total documents that match the query
    const totalBlogs = await Blog.countDocuments(query);

    // Fetch blogs with pagination, search, filtering, and sorting
    const blogs = await Blog.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / limit);

    // Respond with the blogs and pagination data
    res.json({
      data: blogs,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const viewBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.render('viewBlogModal', { blog });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog details" });
  }
};

const editBlog = async (req, res) => {
  try {
    const { title, author, content, brief } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update blog fields
    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.content = content || blog.content;
    blog.brief = brief || blog.brief;

    await blog.save();

    res.status(200).json({ success: true, message: "Blog updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { blogList, addBlog, getBlogs, viewBlog, editBlog };
