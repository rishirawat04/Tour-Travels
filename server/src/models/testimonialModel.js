import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, 
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
      index: true, 
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Archived'],
      default: 'Draft',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

// Adding indexes for optimized queries
testimonialSchema.index({ status: 1, createdAt: -1 })

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;