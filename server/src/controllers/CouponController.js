import Coupon from "../models/CouponModel.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expirationDate, usageLimit } =
      req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    }

    const newCoupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Coupon created successfully",
        coupon: newCoupon,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating coupon",
        error: error.message,
      });
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching coupons",
        error: error.message,
      });
  }
};

// Apply a coupon
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;

    console.log( typeof code);
    
    if (!code || typeof code !== "string") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid coupon code format" 
      });
    }

    if (!cartAmount || typeof cartAmount !== "number" || cartAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart amount must be greater than zero",
      });
    }

    const coupon = await Coupon.findOne({ code: code.trim() });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid coupon code" });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Coupon is expired or usage limit exceeded",
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartAmount * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    // Ensure discount does not exceed cart amount
    discount = Math.min(discount, cartAmount);

  
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount,
      finalAmount: cartAmount - discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying coupon",
      error: error.message,
    });
  }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Coupon deleted successfully",
        coupon: deletedCoupon,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting coupon",
        error: error.message,
      });
  }
};

// Update coupon status
export const updateCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "expired", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCoupon) {
      return res
        .status(404)
        .json(
          { success: false, message: "Coupon not found" }
        );
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Coupon status updated successfully",
        coupon: updatedCoupon,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating coupon status",
        error: error.message,
      });
  }
};

// get admin data

export const getCouponsStats = async (req, res) => {
  try {
    const currentDate = new Date();

    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const totalActiveCoupons = await Coupon.countDocuments({
      status: "active",
    });

    const totalInactiveCoupons = await Coupon.countDocuments({
      status: "inactive",
    });

    const totalExpiredCoupons = await Coupon.countDocuments({
      $or: [{ status: "expired" }, { expirationDate: { $lt: new Date() } }],
    });

    const totalCreatedToday = await Coupon.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const packageDetails = await Coupon.find(
      {},
      {
        code: 1,
        discountType: 1,
        discountValue: 1,
        maxDiscountAmount: 1,
        minPurchaseAmount: 1,
        expirationDate: 1,
        usageLimit: 1,
        usedCount: 1,
        status: 1,
        createdAt: 1,
      }
    );

    res.status(200).json({
      success: true,
      message: "Coupon statistics retrieved successfully.",
      stats: {
        totalActiveCoupons,
        totalInactiveCoupons,
        totalExpiredCoupons,
        totalCreatedToday,
      },
      packageDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupon statistics.",
      error: error.message,
    });
  }
};
