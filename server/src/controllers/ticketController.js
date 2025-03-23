import Chat from "../models/chatmodel.js";
import Ticket from "../models/ticketModel.js";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { userId, subject } = req.body;
    const ticket = await Ticket.create({ userId, subject });
    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Error creating ticket" });
  }
};

// Get tickets by userId (for users) or all tickets (for admin)
export const getTickets = async (req, res) => {
  try {
    const { id, role } = req.user;
    const userId = id;

    const query = role === "admin" ? {} : { userId };
    const tickets = await Ticket.find(query).sort({ updatedAt: -1 });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tickets" });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const {  status } = req.body;
    const { ticketId } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );
    res.status(200).json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Error updating ticket" });
  }
};


export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    // Update the ticket status to "closed"
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status: "closed" },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket closed successfully!", ticket });
  } catch (error) {
    res.status(500).json({ error: "Error closing the ticket. Please try again." });
  }
};


export const getAllTickets = async (req, res) => {
  try {
    
    const tickets = await Ticket.find();

   
    const openTicketsCount = await Ticket.countDocuments({ status: "open" });
    const closedTicketsCount = await Ticket.countDocuments({ status: "closed" });

   
    res.status(200).json({
      success: true,
      data: tickets,
      counts: {
        open: openTicketsCount,
        closed: closedTicketsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);

    // Send an error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};


export const getTicketsStats = async (req, res) => {
  try {
    const currentDate = new Date();

    // Start and end of today
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    // Get all tickets
    const allTickets = await Ticket.find().sort({createdAt: -1});

    // Get counts for open and closed tickets
    const totalTickets = allTickets.length;
    const totalOpenTickets = allTickets.filter(ticket => ticket.status === "open").length;
    const totalClosedTickets = allTickets.filter(ticket => ticket.status === "closed").length;

    // Get today's tickets
    const totalTodaysTickets = allTickets.filter(
      ticket => ticket.createdAt >= startOfDay && ticket.createdAt <= endOfDay
    ).length;

    // Response with stats and ticket details
    res.status(200).json({
      success: true,
      message: "Ticket statistics retrieved successfully.",
      stats: {
        totalTickets,
        totalOpenTickets,
        totalClosedTickets,
        totalTodaysTickets,
      },
      ticketDetails: allTickets.map(ticket => ({
        ticketId: ticket._id,
        userId: ticket.userId,
        subject: ticket.subject,
        status: ticket.status,
        lastReply: ticket.lastReply,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ticket statistics.",
      error: error.message,
    });
  }
};


// delete the tickets with chat
export const deleteTicket = async (req, res) => {
  const { ticketId } = req.params; 
  try {
   
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }

  
    await Chat.deleteMany({ ticketId });


    await Ticket.findByIdAndDelete(ticketId);

    res.status(200).json({ success: true, message: "Ticket and associated chats deleted successfully." });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ success: false, message: "Server error. Could not delete ticket." });
  }
};