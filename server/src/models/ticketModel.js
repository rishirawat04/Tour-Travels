import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    lastReply: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

// Index for faster querying by userId and status
ticketSchema.index({ userId: 1, status: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket