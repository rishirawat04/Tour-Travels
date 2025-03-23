import express from "express";
import { addChatMessage, getChatMessages } from "../controllers/chatController.js";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",verifyToken, addChatMessage);
router.get("/:ticketId",verifyToken, getChatMessages);



export default router;
