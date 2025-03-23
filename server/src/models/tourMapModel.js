import mongoose from 'mongoose';

const tourMapsSchema = new mongoose.Schema(
    {
      mapUrl: {
        type: String,
        default: null,
      },
      startPoint: {
        type: String, 
        required: true,
        index: true,
      },
      endPoint: {
        type: String, 
        required: true,
        index: true,
      },
      guideDetails: {
        type: Object, 
        required: true,
      },
      landmarks: {
        type: [Object], 
        required: true,
      },
      routes: {
        type: Object, 
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package", 
        required: true, 
      },
    },
    { timestamps: true } 
  );
  
  // Compound index for common queries
  tourMapsSchema.index({ startPoint: 1, endPoint: 1 });
  
  const TourMap = mongoose.model("TourMap", tourMapsSchema);
  export default TourMap;