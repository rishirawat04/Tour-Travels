import mongoose from "mongoose";
import deleteImageFromCloudinary from "../helper/deleteImage.js";
import uploadImageToCloudinary from "../helper/uploadImageToCloudinary.js";
import Category from "../models/categoryModel.js";
import Package from "../models/packageModel.js";
import TourMap from "../models/tourMapModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const file = req.files?.image;

    if (!name || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists.",
      });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImageToCloudinary(file);

    // Create new category
    const newCategory = new Category({
      name,
      image: imageUrl,
      status,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const file = req.files?.image;

    // Find the existing category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Handle image update if a new image is provided
    let newImageUrl = category.image;
    if (file) {
      // Delete existing image from Cloudinary
      await deleteImageFromCloudinary(category.image);

      // Upload new image to Cloudinary
      newImageUrl = await uploadImageToCloudinary(file);
    }

    // Update category in the database
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        ...update,
        image: newImageUrl,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category.",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Delete the category image from Cloudinary
    await deleteImageFromCloudinary(category.image);

    // Delete category from the database
    await Category.findByIdAndDelete(id);

    // Delete associated packages and tour maps
    const deletedPackages = await Package.deleteMany({ categoryId: id });
    const deletedTourMaps = await TourMap.deleteMany({ categoryId: id });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: {
        deletedCategory: category,
        deletedPackagesCount: deletedPackages.deletedCount,
        deletedTourMapsCount: deletedTourMaps.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category.",
      error: error.message,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format.",
      });
    }

    // Find category by ID
    const category = await Category.findById(id);

    // If no category found, return a 404 response
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Return the category details
    res.status(200).json({
      success: true,
      message: "Category retrieved successfully.",
      data: category,
    });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({
      success: false,
      message: "Error retrieving category.",
      error: error.message,
    });
  }
};


// Controller to get categories with package count and other details
export const getCategoriesWithPackageCount = async (req, res) => {
  try {
    // Aggregate categories and join with the count of packages
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "categoryId",
          as: "packages",
        },
      },
      {
        $addFields: {
          packageCount: { $size: "$packages" },
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          status: 1,
          createdAt: 1,
          packageCount: 1,
        },
      },
    ]);

    const totalPackages = await Package.countDocuments();

    const activeCategoriesCount = await Category.countDocuments({
      status: "active",
    });

    const inactiveCategoriesCount = await Category.countDocuments({
      status: "inactive",
    });

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayCreatedCategoriesCount = await Category.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of this month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of this month

    const thisMonthCreatedCategoriesCount = await Category.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    return res.status(200).json({
      categories,
      totalPackages,
      activeCategoriesCount,
      inactiveCategoriesCount,
      todayCreatedCategoriesCount,
      thisMonthCreatedCategoriesCount,
    });
  } catch (error) {
    console.error("Error fetching categories with package count:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
