import Testimonial from "../models/testimonialModel.js";


// Create a new testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { userId, comment, status, packageId } = req.body;
    if (!userId ||!comment ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const testimonial = new Testimonial({ userId, comment, status, packageId });
    await testimonial.save();

    res.status(201).json({ message: 'Testimonial created successfully', testimonial });
  } catch (error) {
    res.status(500).json({ error: 'Error creating testimonial', details: error.message });
  }
};

// Retrieve all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const testimonials = await Testimonial.find(filter).populate('userId', 'firstname lastname profilePic address').sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching testimonials', details: error.message });
  }
};

// Retrieve a single testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id).populate('userId');
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching testimonial', details: error.message });
  }
};

// Update a testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, status } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { comment, status },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial updated successfully', testimonial });
  } catch (error) {
    res.status(500).json({ error: 'Error updating testimonial', details: error.message });
  }
};

// Delete a testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting testimonial', details: error.message });
  }
};




export const getReviews = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Aggregate reviews with package and user details
    const reviews = await Testimonial.aggregate([
      {
        $lookup: {
          from: "users", // Reference the "users" collection
          localField: "userId", // Match userId in Testimonial with _id in User
          foreignField: "_id",
          as: "reviewer",
        },
      },
      {
        $unwind: {
          path: "$reviewer",
          preserveNullAndEmptyArrays: true, // Allow null if no match is found
        },
      },
      {
        $lookup: {
          from: "packages", // Reference the "packages" collection
          localField: "packageId", // Match packageId in Testimonial with _id in Package
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $unwind: {
          path: "$package",
          preserveNullAndEmptyArrays: true, // Allow null if no match is found
        },
      },
      {
        $project: {
          reviewId: "$_id", // Testimonial ID
          packageTitle: "$package.title", // Package title
          reviewerName: {
            $concat: ["$reviewer.firstname", " ", "$reviewer.lastname"], // Concatenate first and last name
          },
          reviewerEmail: "$reviewer.email", // Reviewer email
          ratings: "$package.ratings", // Package ratings
          comment: "$comment", // Review comment
          status: "$status", // Review status
          createdAt: "$createdAt", // Testimonial creation date
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by creation date in descending order
    ]);

    // Calculate counts for review statuses
    const totalPublishedReviews = await Testimonial.countDocuments({ status: "Published" });
    const totalDraftReviews = await Testimonial.countDocuments({ status: "Draft" });
    const totalArchivedReviews = await Testimonial.countDocuments({ status: "Archived" });
    const todaysReviews = await Testimonial.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully.",
      data: reviews,
      stats: {
        totalPublishedReviews,
        totalDraftReviews,
        totalArchivedReviews,
        todaysReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error retrieving reviews.",
      error: error.message,
    });
  }
};

