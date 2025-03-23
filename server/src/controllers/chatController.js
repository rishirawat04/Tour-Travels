import Chat from "../models/chatmodel.js";
import Ticket from "../models/ticketModel.js";

// Add a chat message to a ticket
export const addChatMessage = async (req, res) => {
  try {
    const { ticketId, message,  } = req.body;
    const {id, role} = req.user
    const senderId = id
    if (!ticketId ||!senderId ||!message || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const chat = await Chat.create({ ticketId, senderId, message, role });
    await Ticket.findByIdAndUpdate(ticketId, {
      lastReply: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: "Chat message added", chat });
  } catch (error) {
    res.status(500).json({ error: "Error adding chat message" });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { id: userId } = req.user; 

    // Verify the ticket belongs to the user
    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
      return res
        .status(404)
        .json({ error: "Ticket not found or access denied" });
    }

    // Fetch messages with role and sender information
    const messages = await Chat.find({ ticketId })
      .sort({ createdAt: 1 })
      .populate("senderId", "firstname lastname role") 
      .select("message senderId role createdAt");

    const structuredMessages = messages.map((msg) => ({
      id: msg._id,
      content: msg.message,
      role: msg.role,
      createdAt: msg.createdAt,
      senderName:
        msg.senderId.role === "admin"
          ? "Admin"
          : `${msg.senderId.firstname} ${msg.senderId.lastname}`,
    }));

    res.status(200).json({ messages: structuredMessages });
  } catch (error) {
    res.status(500).json({ error: "Error fetching chat messages" });
  }
};
