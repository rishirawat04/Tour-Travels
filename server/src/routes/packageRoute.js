import express from "express";
import { createPackage, deletePackage, getAllPackages, getPackages, getPackagesByDestination, getSearchResults, getTopDestinations, updatePackage } from "../controllers/packageController.js";
import { createTourMap, deleteTourMap, getTourMaps, updateTourMap } from "../controllers/tourController.js";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();



// Package routes
router.post("/",verifyToken, verifyRole("admin"), createPackage);
router.get("/", getPackages);
router.get("/destinations", getTopDestinations);
router.get("/search", getSearchResults);

// admin routes
router.get("/allData", getPackagesByDestination);
router.get("/getAllPackages", getAllPackages);
router.put("/:id",verifyToken, verifyRole("admin"), updatePackage);
router.delete("/:id", verifyToken, verifyRole("admin"), deletePackage);


// Tour Map routes
router.get("/tour-maps", getTourMaps);

// admin routes for Tour Map
router.post("/tour-maps",verifyToken, verifyRole("admin"), createTourMap);
router.put("/tour-maps/:id", verifyToken, verifyRole("admin"), updateTourMap);
router.delete("/tour-maps/:id", verifyToken, verifyRole("admin"), deleteTourMap);

export default router;
