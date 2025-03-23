import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },

    expirationDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number, 
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Check if coupon is expired or usage limit exceeded
couponSchema.methods.isValid = function () {
  const currentDate = new Date();
  if (this.expirationDate < currentDate) return false;
  if (this.usedCount >= this.usageLimit) return false;
  return this.status === "active";
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
