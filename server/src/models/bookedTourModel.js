import mongoose from 'mongoose';

const bookedTourSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  bookingDate: { type: Date, default: Date.now },
  travelDate: { type: Date, required: true },
  status: { type: String, default: 'Upcoming', enum: ['Upcoming', 'Completed', 'Cancelled', 'Expired'] },
});

const BookedTour = mongoose.model('BookedTour', bookedTourSchema);
export default BookedTour;
