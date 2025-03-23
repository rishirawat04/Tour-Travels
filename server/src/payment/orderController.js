import razorpayInstance from "../utils/razorpay.js";
import Order from "../models/orderModel.js";
import Package from "../models/packageModel.js";
import Coupon from "../models/CouponModel.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { packageId, totalAmount, quantity, discountCode } = req.body;
    const userId = req.user?.id;

    // Validate inputs
    if (!userId || !packageId || !totalAmount || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate quantity
    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity value" });
    }

    // Fetch package details to ensure package exists
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    if (packageData.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "Package is inactive. Booking not possible.",
      });
    }

    // Calculate the original price based on package price and quantity
    const originalPrice = packageData.price * quantity;

    let discount = 0;

    // If a discount code is provided, apply the coupon
    if (discountCode) {
      const coupon = await Coupon.findOne({ code: discountCode.trim() });

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

      // Calculate the discount
      if (coupon.discountType === "percentage") {
        discount = (originalPrice * coupon.discountValue) / 100;
      } else if (coupon.discountType === "fixed") {
        discount = coupon.discountValue;
      }

      // Ensure the discount does not exceed the original price
      discount = Math.min(discount, originalPrice);

      // Increment coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    // Calculate the final price after applying the discount
    const finalPrice = originalPrice - discount;

    // Ensure the provided totalAmount matches the calculated final price
    if (totalAmount !== finalPrice) {
      return res.status(400).json({
        success: false,
        message: "Price mismatch. Possible tampering detected.",
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(finalPrice * 100),
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2)}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Save the order to the database
    const order = new Order({
      userId,
      packageId,
      quantity,
      totalAmount: finalPrice,
      discountCode : discountCode || "not provided",
      discount,
      status: "Pending",
      orderDate: new Date(),
      razorpayOrderId: razorpayOrder.id,
    });

    await order.save({ session });
    console.log(razorpayOrder.id, razorpayOrder.amount, razorpayOrder.currency);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Order created successfully",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in createOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// get the order details for user account
export const getBookingSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Aggregation pipeline to fetch summary and orders
    const pipeline = [
      {
        $match: {
          status: "Confirmed",
          userId: new mongoose.Types.ObjectId(userId), // Ensure `userId` is an ObjectId
        },
      },
      {
        $lookup: {
          from: "packages", // Collection name for `Package`
          localField: "packageId",
          foreignField: "_id",
          as: "packageDetails",
        },
      },
      {
        $unwind: "$packageDetails", // Flatten the `packageDetails` array
      },
      {
        $lookup: {
          from: "users", // Collection name for `User`
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Flatten the `userDetails` array
      },
      {
        $group: {
          _id: null,
          totalTours: { $sum: 1 },
          totalPersons: { $sum: "$quantity" },
          totalPaidAmount: { $sum: { $toDecimal: "$totalAmount" } },
          orders: {
            $push: {
              orderId: "$_id",
              package: {
                packageId: "$packageDetails._id",
                name: "$packageDetails.name",
                destination: "$packageDetails.destination",
                pricePerPerson: { $toDouble: "$packageDetails.price" },
                details: "$packageDetails.details",
              },
              user: {
                userId: "$userDetails._id",
                name: "$userDetails.name",
                email: "$userDetails.email",
                phone: "$userDetails.phone",
              },
              quantity: "$quantity",
              totalAmount: { $toDouble: "$totalAmount" },
              discount: { $toDouble: "$discount" },
              tourDate: "$orderDate",
              status: "$status",
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove the `_id` field from the final output
          totalTours: 1,
          totalPersons: 1,
          totalPaidAmount: 1,
          orders: 1,
        },
      },
    ];

    // Execute aggregation pipeline
    const [result] = await Order.aggregate(pipeline);

    // Format response
    res.status(200).json({
      success: true,
      message: "Booking summary retrieved successfully",
      data: result || {
        summary: {
          totalBookedTours: 0,
          totalTransactions: 0,
          totalPaidAmount: 0,
          totalPersons: 0,
        },
        orders: [],
      },
    });
  } catch (error) {
    console.error("Error in getBookingSummary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking summary",
    });
  }
};


