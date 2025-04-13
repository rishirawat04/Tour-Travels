import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    phonenumber: { type: String, required: true },
    password: { type: String, required: true },
    address: {
      homeNo: { type: String },
      colony: { type: String },
      landmark: { type: String },
      pincode: { type: String },
      city: { type: String },
      state: { type: String },
    },
    profilePic: { type: String, default: null },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "deactived"], default: "active" },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    isOTPVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create indexes for fields
// Removed duplicate email and username indexes as they're already unique in the schema
userSchema.index({ otp: 1 });
userSchema.index({ otpExpiry: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
