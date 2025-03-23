import deleteImageFromCloudinary from "../helper/deleteImage.js";
import uploadImageToCloudinary from "../helper/uploadImageToCloudinary.js";
import Blog from "../models/blogModel.js";

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, description, adminUserId } = req.body;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Start image upload immediately
    const imageUploadPromise = uploadImageToCloudinary(req.files.image);

    // Prepare blog data for MongoDB
    const blogData = { title, description, adminUserId };

    // Wait for the image upload and MongoDB save to complete in parallel
    const [imageUrl] = await Promise.all([imageUploadPromise]);

    blogData.image = imageUrl;

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating blog", details: error.message });
  }
};

// Retrieve all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching blogs", details: error.message });
  }
};

// Retrieve a single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate('adminUserId', 'firstname lastname profilePic');
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching blog", details: error.message });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // If an image is being updated, delete the old image and upload the new one
    if (req.files && req.files.image) {
      await deleteImageFromCloudinary(blog.image);
      const newImage = await uploadImageToCloudinary(req.files.image);
      blog.image = newImage;
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating blog", details: error.message });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Delete the image from Cloudinary
    await deleteImageFromCloudinary(blog.image);

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting blog", details: error.message });
  }
};
