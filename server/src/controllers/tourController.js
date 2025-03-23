import Category from "../models/categoryModel.js";
import Package from "../models/packageModel.js";
import TourMap from "../models/tourMapModel.js";


/**
 * POST /api/tour-maps
 * Create a new tour map
 */
export const createTourMap = async (req, res) => {
  try {
    const { packageId, mapUrl, startPoint, endPoint, guideDetails, landmarks, routes } = req.body;

    if (!packageId || !startPoint || !endPoint || !guideDetails || !landmarks || !routes ) {
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    // Validate package exists
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }
    
   
    const newTourMap = new TourMap({
      packageId,
      mapUrl,
      startPoint,
      endPoint,
      guideDetails,
      landmarks,
      routes,
    });
    await newTourMap.save();
    pkg.tourMap = newTourMap._id
    await pkg.save()
    

    res.status(201).json({
      success: true,
      message: "Tour map created successfully.",
      data: newTourMap,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTourMaps = async (req, res) => {
  try {
    const { startPoint, endPoint, packageId, categoryId } = req.query;

    // Build the query dynamically
    const query = {};
    if (startPoint) query.startPoint = new RegExp(startPoint, "i");
    if (endPoint) query.endPoint = new RegExp(endPoint, "i");
    if (packageId) query.packageId = packageId;
    if (categoryId) query.categoryId = categoryId;

    // Fetch tour maps based on query
    const tourMaps = await TourMap.find(query).populate("packageId").populate("categoryId");

    res.status(200).json({
      success: true,
      message: "Tour maps retrieved successfully.",
      data: tourMaps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tour maps.",
      error: error.message,
    });
  }
};

export const updateTourMap = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Update the tour map
    const updatedTourMap = await TourMap.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true } // Return updated document
    ).populate("packageId")

    if (!updatedTourMap) {
      return res.status(404).json({
        success: false,
        message: "Tour map not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour map updated successfully.",
      data: updatedTourMap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating tour map.",
      error: error.message,
    });
  }
};

export const deleteTourMap = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the tour map
    const deletedTourMap = await TourMap.findByIdAndDelete(id);
    if (!deletedTourMap) {
      return res.status(404).json({
        success: false,
        message: "Tour map not found.",
      });
    }

    // Remove the reference from the associated package
    await Package.findByIdAndUpdate(deletedTourMap.packageId, { tourMap: null });

    res.status(200).json({
      success: true,
      message: "Tour map deleted successfully and reference removed from package.",
      data: deletedTourMap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting tour map.",
      error: error.message,
    });
  }
};
