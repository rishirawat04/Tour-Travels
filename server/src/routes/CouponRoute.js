import express from "express";
import {
  createCoupon,
  applyCoupon,

} from "../controllers/CouponController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new coupon (Admin Only)
router.post("/", verifyToken, verifyRole("admin"), createCoupon);


// Apply a coupon
router.post("/apply", verifyToken, applyCoupon);



export default router;
