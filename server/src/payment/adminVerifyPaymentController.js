import razorpayInstance from "../utils/razorpay.js";
import PaymentDetails from "../models/paymentDetailsModel.js";
import BookedTour from "../models/bookedTourModel.js";

export const adminVerifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    // Validate inputs
    if (!paymentId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find payment details using the provided orderId and paymentId
    const paymentDetailsRecord = await PaymentDetails.findOne({ 
      "paymentDetails.razorpay_order_id": orderId,
      "paymentDetails.razorpay_payment_id": paymentId 
    }).populate("orderId packageId userId");

    if (!paymentDetailsRecord) {
      return res.status(404).json({
        success: false,
        message: "Payment details not found or mismatched credentials",
      });
    }

    // Verify if the payment is already confirmed
    if (paymentDetailsRecord.paymentVerifiedByAdmin) {
      return res.status(400).json({ success: false, message: "Payment is already verified by admin" });
    }

    // Check the payment status from Razorpay
    const payment = await razorpayInstance.payments.fetch(paymentId);
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment not valid or not captured",
      });
    }

    // Update payment verification status
    paymentDetailsRecord.paymentVerifiedByAdmin = true;
    paymentDetailsRecord.status = "Completed";
    paymentDetailsRecord.updatedAt = new Date();
    await paymentDetailsRecord.save();

    // Update related order status
    const order = paymentDetailsRecord.orderId;
    if (order.status === "Confirmed") {
     
      order.verifiedByAdmin = true;
      await order.save();
    }

    // Create or update the booked tour entry
    const existingBookedTour = await BookedTour.findOne({
      userId: paymentDetailsRecord.userId._id,
      orderId: order._id,
      packageId: paymentDetailsRecord.packageId._id,
    });

    if (!existingBookedTour) {
      const packageDetails = paymentDetailsRecord.packageId;
      const bookedTour = new BookedTour({
        userId: paymentDetailsRecord.userId._id,
        packageId: packageDetails._id,
        orderId: order._id,
        travelDate: packageDetails.startDate,
      });
      await bookedTour.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment successfully verified by admin",
    });
  } catch (error) {
    console.error("Error in adminVerifyPayment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

