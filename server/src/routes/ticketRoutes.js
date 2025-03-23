import express from "express";
import { closeTicket, createTicket, getAllTickets, getTickets, getTicketsStats, updateTicketStatus } from "../controllers/ticketController.js";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",verifyToken, createTicket);
router.get("/allticketsStats", getTicketsStats);
router.get("/",verifyToken, getTickets);
router.get("/alltickets", getAllTickets);
router.patch("/status",verifyToken, verifyRole("admin"), updateTicketStatus);
router.patch("/user/status",verifyToken, closeTicket);

export default router;
