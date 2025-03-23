import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useParams } from "react-router-dom";
import {
  getTicketChat,
  createTicketChat,
  closeTicket,
} from "../api/dashboardApi";
import { useSnackbar } from "./SnackbarProvider";

const SupportTicketChat = () => {
  const { showSnackbar } = useSnackbar();
  const { ticketId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getTicketChat(ticketId);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching ticket chat messages:", error);
      }
    };

    fetchMessages();
  }, [ticketId]);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    try {
      const response = await createTicketChat(ticketId, newMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: response.data.id,
          content: newMessage,
          role: "user",
          createdAt: new Date().toISOString(),
          senderName: "You",
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCloseTicket = async () => {
    try {
      // Call the close ticket API
      const response = await closeTicket(ticketId);

      showSnackbar(
        response.data.message || "Ticket closed successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error.response?.data?.error || "Failed to close the ticket!",
        "error"
      );
    }
  };

  return (
    <Box display="flex" flexDirection="column" bgcolor="background.paper">
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Ticket #{ticketId} Chat</Typography>
        <Button variant="outlined" onClick={handleCloseTicket}>
          Close Ticket
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                bgcolor: msg.role === "user" ? "#d1f7c4" : "#fff",
                borderRadius: "10px",
                maxWidth: "70%",
              }}
            >
              <Typography variant="body2">{msg.content}</Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
               textAlign="left"
              >
                {msg.senderName} |{" "}
                {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          p: 2,
          bgcolor: "#f6faff",
          borderTop: "1px solid #eee",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default SupportTicketChat;
