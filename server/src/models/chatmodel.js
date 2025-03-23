import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add indexes
chatSchema.index({ ticketId: 1 });
chatSchema.index({ ticketId: 1, senderId: 1 });
chatSchema.index({ ticketId: 1, senderId: 1, role: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
