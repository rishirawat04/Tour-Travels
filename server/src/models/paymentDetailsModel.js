import mongoose from 'mongoose';

const paymentDetailsSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  method: { type: String, required: true },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Failed'] },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  paymentDetails: { type: Object, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  paymentVerifiedByAdmin: { type: Boolean, default: false },
});

const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema);
export default PaymentDetails;