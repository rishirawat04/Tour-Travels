import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema(
    {
      name: {
        type: String, 
        unique: true,
        required: true,
        index: true, 
      },
      image: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"],
        index: true, 
      },
      createdAt: {
        type: Date, 
        default: Date.now,
      },
      updatedAt: {
        type: Date, 
        default: Date.now,
      },
    },
    { timestamps: true } 
  );
  
  const Category = mongoose.model("Category", categoriesSchema);
  export default Category;