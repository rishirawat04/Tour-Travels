import mongoose from "mongoose";
import BookedTour from "../models/bookedTourModel.js";

// get bookedTour details 
export const getTourStatistics = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
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
          username: { $concat: ["$user.firstname", " ", "$user.lastname"] },
          packageTitle: "$package.title",
          duration: "$package.duration",
          price: "$package.price",
          verifiedByAdmin: "$order.verifiedByAdmin",
        },
      },
      {
        $facet: {
          tourCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          toursNotVerifiedByAdmin: [
            {
              $match: {
                verifiedByAdmin: false,
              },
            },
            {
              $count: "count",
            },
          ],
          todayTours: [
            {
              $match: {
                bookingDate: { $gte: todayStart, $lte: todayEnd },
              },
            },
            {
              $count: "count",
            },
          ],
          details: [
            {
              $project: {
                bookingId: "$_id",
                bookingDate: 1,
                duration: 1,
                price: 1,
                username: 1,
                packageTitle: 1,
                status: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ];

    const result = await BookedTour.aggregate(pipeline);

    const statistics = {
      completedTours: result[0]?.tourCounts?.find((t) => t._id === "Completed")?.count || 0,
      pendingTours: result[0]?.tourCounts?.find((t) => t._id === "Upcoming")?.count || 0,
      cancelledTours: result[0]?.tourCounts?.find((t) => t._id === "Cancelled")?.count || 0,
      expiredTours: result[0]?.tourCounts?.find((t) => t._id === "Expired")?.count || 0,
      todayBookedTours: result[0]?.todayTours[0]?.count || 0,
      toursNotVerifiedByAdmin: result[0]?.toursNotVerifiedByAdmin[0]?.count || 0,
      details: result[0]?.details || [],
    };

    res.status(200).json({
      success: true,
      statistics,
    });
  } catch (error) {
    console.error("Error in getTourStatistics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Update Tour Status Controller
export const updateStatus = async (req, res) => {
  const { tourId, newStatus } = req.body;
  console.log(tourId);
  

  try {
    // Find the tour by ID
    const tour = await BookedTour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' }); 
    }

    // Validate status change
    if (!['Upcoming', 'Completed', 'Cancelled', 'Expired'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' }); 
    }

    // Update the tour status
    tour.status = newStatus;
    await tour.save();

    return res.status(200).json({ message: 'Tour status updated successfully', tour }); 
  } catch (error) {
    console.error('Error updating tour status:', error);
    return res.status(500).json({ message: 'Error updating tour status', error: error.message });
  }
};

// Delete Tour Controller
export const deleteTour = async (req, res) => {
  const { tourId } = req.params;

  try {
   
    const tour = await BookedTour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' }); 
    }

    // Delete the tour
    await tour.remove();

    return res.status(200).json({ message: 'Tour deleted successfully' }); 
  } catch (error) {
    console.error('Error deleting tour:', error);
    return res.status(500).json({ message: 'Error deleting tour', error: error.message }); 
  }
};



export const getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;

  try {
  
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }

   
    const bookingDetails = await BookedTour.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(bookingId) }, 
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $lookup: {
          from: "orders", 
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $lookup: {
          from: "paymentdetails", 
          let: { userId: "$userId", orderId: "$orderId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$orderId", "$$orderId"] },
                  ],
                },
              },
            },
          ],
          as: "payment",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$package", preserveNullAndEmptyArrays: true }, 
      },
      {
        $unwind: { path: "$order", preserveNullAndEmptyArrays: true }, 
      },
      {
        $unwind: { path: "$payment", preserveNullAndEmptyArrays: true }, 
      },
      {
        $addFields: {
          "user.previousBookings": {
            $filter: {
              input: "$user.bookings", 
              as: "booking",
              cond: { $ne: ["$$booking", bookingId] },
            },
          },
          "payment.couponApplied": {
            $cond: {
              if: { $gt: ["$order.discount", 0] },
              then: "Yes",
              else: "No",
            },
          },
          "payment.discountAmount": "$order.discount",
          "payment.couponCode": "$order.discountCode",
        },
      },
      {
        $project: {
          _id: 0,
          bookingId: "$_id",
          user: {
            name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
            userId:"$user._id",
            email: "$user.email",
            phone: "$user.phonenumber",
            profile:"$user.profilePic",
            previousBookings: "$user.previousBookings",
          },
          package: "$package",
          payment: {
            bookingId: "$payment.orderId",
            totalAmount: "$order.totalAmount",
            paidAmount: "$payment.amount",
            couponApplied: "$payment.couponApplied",
            couponCode: "$payment.couponCode",
            discountAmount: "$payment.discountAmount",
          },
        },
      },
    ]);

    if (!bookingDetails || bookingDetails.length === 0) {
      return res.status(404).json({ message: "Booking details not found." });
    }

    // Send response
    res.status(200).json({
      message: "Booking details fetched successfully.",
      data: bookingDetails[0], 
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({
      message: "An error occurred while fetching booking details.",
      error: error.message,
    });
  }
};

