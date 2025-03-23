import mongoose from 'mongoose';

const packagesSchema = new mongoose.Schema(
  {
    images: {
      type: [String], 
    
    },
    ratings: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number, 
      required: true,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      required: true,
      index: true, 
    },
    destination: {
      type: String, 
      required: true,
      index: true, 
    },
    duration: {
      type: String,
      required: true,
    },
    tourType: {
      type: String, 
      required: true,
      index: true,
    },
    minTravelers: {
      type: Number,
      required: true,
    },
    maxTravelers: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
      index: true,
    },
    overview: {
      type: Object,  
    },
    startDate: {
      type: Date,
      required: true, 
      index: true,
    },
    included: {
      type: [
        {
          title: { type: String, required: true }, 
        },
      ],
    
    },
    tourMap: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "TourMap",
      index: true,
    },
    createdAt: {
      type: Date, 
      default: Date.now,
    },
  },
  { timestamps: true } 
);

// Compound index for frequent queries
packagesSchema.index({ destination: 1, startDate: 1, status: 1 });

const Package = mongoose.model("Package", packagesSchema);
export default Package;