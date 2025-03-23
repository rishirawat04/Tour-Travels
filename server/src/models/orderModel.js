import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
  discountCode: { type: String },
  discount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Confirmed', 'Cancelled'] 
  },
  razorpayOrderId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  verifiedByAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
