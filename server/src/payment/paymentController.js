import crypto from "crypto";
import PaymentDetails from "../models/paymentDetailsModel.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user?.id;

    // Verify user authentication explicitly
    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login to continue.",
        requiresAuth: true
      });
    }

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find the order in the database
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);
    
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status === "Confirmed") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Order already confirmed" });
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
   

    if (generatedSignature !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
    
    // Save payment details
    const paymentDetails = new PaymentDetails({
      transactionId: razorpay_payment_id,
      method: "Razorpay",
      amount: parseFloat(order.totalAmount),
      status: "Completed",
      date: new Date(),
      userId: order.userId,
      orderId: order._id,
      packageId: order.packageId,
      paymentDetails: req.body,
    });

    await paymentDetails.save({ session });

    // Update order status
    order.status = "Confirmed";
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error during payment verification" 
    });
  } finally {
    session.endSession();
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await PaymentDetails.find()
      .populate("userId")
      .populate("orderId")
      .populate("packageId");

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error in getPayments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get payment details by userId
export const getPaymentDetailsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    // Fetch payment details for the given userId
    const payments = await PaymentDetails.find({ userId })
      .populate('orderId', 'orderId')
      .populate('packageId', 'destination') 
      .select('transactionId method amount status createdAt'); 

    if (!payments.length) {
      return res.status(404).json({ success: false, message: 'No payment details found.' });
    }

   
    const formattedPayments = payments.map((payment) => ({
      transactionId: payment.transactionId,
      method: payment.method,
      amount: payment.amount,
      status: payment.status,
      bookingAt: payment.createdAt.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      message: 'Payment details retrieved successfully.',
      data: formattedPayments,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching payment details.',
    });
  }
};

// get payment details 
export const getPaymentStatistics = async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "users", 
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, 
      {
        $addFields: {
          touristName: { $concat: ["$user.firstname", " ", "$user.lastname"] },
        },
      },
      {
        $facet: {
        
          paymentCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          paymentDetails: [
            {
              $project: {
                transactionId: 1,
                touristName: 1,
                method: 1,
                amount: 1,
                status: 1,
                date: 1,
                payableAmount: "$amount",
                paymentVerifiedByAdmin: 1,
              },
              
            },
          ],
        },
      },
    ];

    const result = await PaymentDetails.aggregate(pipeline);

    // Parse counts into a structured format
    const counts = {
      totalPayments: result[0]?.paymentDetails.length || 0,
      successPayments:
        result[0]?.paymentCounts.find((c) => c._id === "Completed")?.count || 0,
      pendingPayments:
        result[0]?.paymentCounts.find((c) => c._id === "Pending")?.count || 0,
      failedPayments:
        result[0]?.paymentCounts.find((c) => c._id === "Failed")?.count || 0,
    };

    res.status(200).json({
      success: true,
      counts,
      paymentLogs: result[0]?.paymentDetails || [],
    });
  } catch (error) {
    console.error("Error in getPaymentStatistics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
