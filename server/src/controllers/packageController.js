import uploadImageToCloudinary from "../helper/uploadImageToCloudinary.js";
import Category from "../models/categoryModel.js";
import Package from "../models/packageModel.js";
import TourMap from "../models/tourMapModel.js";
import cloudinary from "../utils/cloudinary.js";

/**
 * POST /api/packages
 * Create a new package
 */

export const createPackage = async (req, res) => {
  try {
    const {
      categoryId,
      ratings,
      price,
      discountPrice,
      title,
      destination,
      duration,
      tourType,
      minTravelers,
      maxTravelers,
      status,
      overview,
      included,
      startDate,
    } = req.body;
    const files = req.files.image || req.body.images;

    if (
      !categoryId ||
      !files ||
      !files.length === 0 ||
      !price ||
      !title ||
      !destination ||
      !duration ||
      !tourType ||
      !minTravelers ||
      !maxTravelers ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Upload images to Cloudinary
    const imagesUploadPromises = Array.isArray(files)
      ? files.map((file) => uploadImageToCloudinary(file))
      : [uploadImageToCloudinary(files)];

    const uploadedImages = await Promise.all(imagesUploadPromises);

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    const newPackage = new Package({
      categoryId,
      images: uploadedImages,
      ratings,
      price,
      discountPrice,
      title,
      destination,
      duration,
      tourType,
      minTravelers,
      maxTravelers,
      status,
      overview,
      included,
      startDate,
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: newPackage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Package Controller
 */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const files = req.files?.images;

    // Find the existing package
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    // Delete old images from Cloudinary if new images are provided
    if (files && existingPackage.images.length > 0) {
      // Loop through the old images and delete from Cloudinary
      for (const image of existingPackage.images) {
        const publicId = image.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.v2.uploader.destroy(`toursAndTravel/${publicId}`);
      }

      // Upload new images to Cloudinary
      const imagesUploadPromises = Array.isArray(files)
        ? files.map((file) => uploadImageToCloudinary(file))
        : [uploadImageToCloudinary(files)];
      const uploadedImages = await Promise.all(imagesUploadPromises);

      updates.images = uploadedImages;
    }

    // Validate and update startDate if provided
    if (updates.startDate && isNaN(Date.parse(updates.startDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate provided.",
      });
    }

    // Update the package document
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    )
      .populate("categoryId")
      .populate("tourMap");

    res.status(200).json({
      success: true,
      message: "Package updated successfully.",
      data: updatedPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating package.",
      error: error.message,
    });
  }
};

/**
 * Delete Package Controller
 */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing package
    const packageToDelete = await Package.findById(id);
    if (!packageToDelete) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    // Delete associated images from Cloudinary
    if (packageToDelete.images.length > 0) {
      for (const image of packageToDelete.images) {
        const publicId = image.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.v2.uploader.destroy(`toursAndTravel/${publicId}`);
      }
    }

    // Delete the package
    const deletedPackage = await Package.findByIdAndDelete(id);

    // Delete the associated TourMap
    const deletedTourMap = await TourMap.deleteMany({ packageId: id });

    res.status(200).json({
      success: true,
      message: "Package deleted successfully.",
      data: {
        deletedPackage,
        deletedTourMapCount: deletedTourMap.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting package.",
      error: error.message,
    });
  }
};

export const getPackages = async (req, res) => {
  try {
    const { title, destination, categoryId, status, packageId } = req.query;

    const query = {};
    if (packageId) {
      // Directly fetch a specific package by ID
      const package1 = await Package.findById(packageId)
        .populate("categoryId")
        .populate("tourMap");
      if (!package1) {
        return res.status(404).json({
          success: false,
          message: "Package not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Package retrieved successfully.",
        data: package1,
      });
    }

    if (title) query.title = new RegExp(title, "i");
    if (destination) query.destination = new RegExp(destination, "i");
    if (categoryId) query.categoryId = categoryId;
    if (status) query.status = status;

    // Fetch packages matching the query or all if no query is provided
    const packages = await Package.find(query)
      .populate("categoryId")
      .populate("tourMap");

    res.status(200).json({
      success: true,
      message: "Packages retrieved successfully.",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving packages.",
      error: error.message,
    });
  }
};
export const getPackageById = async (req, res) => {
  try {
    const { title, destination, categoryId, status } = req.query;
    const { packageId } = req.params;

    const query = {};
    if (packageId) {
      // Directly fetch a specific package by ID
      const package1 = await Package.findById(packageId)
        .populate("categoryId")
        .populate("tourMap");
      if (!package1) {
        return res.status(404).json({
          success: false,
          message: "Package not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Package retrieved successfully.",
        data: package1,
      });
    }

    if (title) query.title = new RegExp(title, "i");
    if (destination) query.destination = new RegExp(destination, "i");
    if (categoryId) query.categoryId = categoryId;
    if (status) query.status = status;

    // Fetch packages matching the query or all if no query is provided
    const packages = await Package.find(query)
      .populate("categoryId")
      .populate("tourMap");

    res.status(200).json({
      success: true,
      message: "Packages retrieved successfully.",
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving packages.",
      error: error.message,
    });
  }
};

export const getTopDestinations = async (req, res) => {
  try {
    // Get unique destinations with image and duration from the Package model
    const destinations = await Package.aggregate([
      {
        $group: {
          _id: "$destination",
          image: { $first: "$images" },
          duration: { $first: "$duration" },
        },
      },
      {
        $project: {
          destination: "$_id",
          image: 1,
          duration: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json(destinations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Failed to get top destinations. Please try again." });
  }
};

// Function to clean up the search query
const cleanSearchQuery = (query) => {
  return query.trim().toLowerCase();
};

export const getSearchResults = async (req, res) => {
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({
      success: false,
      message: "Destination query parameter is required",
    });
  }

  const cleanedQuery = cleanSearchQuery(destination);

  try {
    // Split the query into parts by spaces or commas for flexible matching
    const queryParts = cleanedQuery.split(/[,\s]+/).filter((part) => part);

    // Build a case-insensitive regex pattern that matches any of the parts
    const searchRegex = new RegExp(queryParts.join("|"), "i");

    // Perform the search query
    const packages = await Package.find({
      destination: searchRegex,
      status: "active",
    });

    // Return results with success flag
    if (packages.length > 0) {
      return res.json({ success: true, data: packages });
    } else {
      return res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.error("Error searching packages:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

export const getPackagesByDestination = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const packagesSummary = await Package.aggregate([
      {
        $facet: {
          destinationStatusCounts: [
            {
              $group: {
                _id: "$destination",
                activePackages: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                  },
                },
                inactivePackages: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "inactive"] }, 1, 0],
                  },
                },
              },
            },
            {
              $group: {
                _id: null,
                totalActiveDestinations: {
                  $sum: {
                    $cond: [{ $gt: ["$activePackages", 0] }, 1, 0],
                  },
                },
                totalInactiveDestinations: {
                  $sum: {
                    $cond: [{ $gt: ["$inactivePackages", 0] }, 1, 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalActiveDestinations: 1,
                totalInactiveDestinations: 1,
              },
            },
          ],

          packageCounts: [
            {
              $group: {
                _id: null,
                totalPackages: { $sum: 1 },
                createdThisMonth: {
                  $sum: {
                    $cond: [{ $gte: ["$createdAt", startOfMonth] }, 1, 0],
                  },
                },
                createdToday: {
                  $sum: {
                    $cond: [{ $gte: ["$createdAt", today] }, 1, 0],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalPackages: 1,
                createdThisMonth: 1,
                createdToday: 1,
              },
            },
          ],

          destinationDetails: [
            {
              $group: {
                _id: "$destination",
                packages: {
                  $push: {
                    status: "$status",
                    createdAt: "$createdAt",
                    images: "$images",
                  },
                },
                packagesCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                destination: "$_id",

                packagesCount: 1,
                packages: 1,
              },
            },
            {
              $sort: { packagesCount: -1 },
            },
          ],
        },
      },
    ]);

    const result = {
      totalActiveDestinations:
        packagesSummary[0].destinationStatusCounts[0]
          ?.totalActiveDestinations || 0,
      totalInactiveDestinations:
        packagesSummary[0].destinationStatusCounts[0]
          ?.totalInactiveDestinations || 0,
      totalPackages: packagesSummary[0].packageCounts[0]?.totalPackages || 0,
      createdToday: packagesSummary[0].packageCounts[0]?.createdToday || 0,
      createdThisMonth:
        packagesSummary[0].packageCounts[0]?.createdThisMonth || 0,
      destinationDetails: packagesSummary[0].destinationDetails,
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching package summary:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const packagesData = await Package.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "tourmaps",
          localField: "tourMap",
          foreignField: "_id",
          as: "tourMap",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$tourMap",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          images: 1,
          title: 1,
          destination: 1,
          status: 1,
          createdAt: 1,
          "category.name": 1,
          "category.image": 1,
          "tourMap.startPoint": 1,
          "tourMap.endPoint": 1,
        },
      },
    ]);

    const totalPackages = await Package.countDocuments();
    const activePackages = await Package.countDocuments({ status: "active" });
    const inactivePackages = await Package.countDocuments({
      status: "inactive",
    });
    const todayCreatedPackages = await Package.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const thisMonthCreatedPackages = await Package.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    return res.status(200).json({
      success: true,
      message: "Packages retrieved successfully.",
      data: packagesData,
      stats: {
        totalPackages,
        activePackages,
        inactivePackages,
        todayCreatedPackages,
        thisMonthCreatedPackages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving packages.",
      error: error.message,
    });
  }
};
