import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { RemoveRedEyeOutlined, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../components/CustomPagination";
import { createSupportTickets, getSupportTickets } from "../api/dashboardApi";

import { useSelector } from "react-redux";
import { useSnackbar } from "../components/SnackbarProvider";

const SupportTicket = () => {
  const { userId } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [subject, setSubject] = useState("");

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getSupportTickets();
        setTickets(data.tickets);
        setFilteredTickets(data.tickets);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = tickets.filter((ticket) =>
      ticket.subject.toLowerCase().includes(query)
    );
    setFilteredTickets(filtered);
  };

  // Handle Pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Handle Create Ticket Submission
  const handleCreateTicket = async () => {
    try {
      const response = await createSupportTickets(userId, subject);
      setOpenModal(false);
      setSubject("");
      

      showSnackbar(response.data.message || "ticket raised", "success");
      const data = await getSupportTickets();
      setTickets(data.tickets);
      setFilteredTickets(data.tickets);
    } catch (error) {
      console.error("Error creating ticket:", error);
      showSnackbar(
        error.response.data.error || "Failed to add package to favorites!",
        "error"
      );
    }
  };

  return (
    <Box>
      <Box sx={{ border: "10px", my: 2, borderColor: "#888" }} />

      {/* Search and Actions Table */}
      <Box component={Paper} sx={{ bgcolor: "#fff", mt: 4 }}>
        <Typography sx={{ fontSize: "25px", p: 1 }}>Support Ticket</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            p: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search Tickets"
              variant="standard"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                disableUnderline: false,
              }}
              sx={{
                "& .MuiInput-underline:before": {
                  borderBottomColor: "gray",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "gray",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "darkgray",
                },
                "& label": {
                  color: "gray",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "gray",
                },
              }}
            />
            <Search sx={{ mt: 2.2, color: "gray" }} />
          </Box>
          <Button sx={{ border: 1 }} onClick={() => setOpenModal(true)}>
            Create Ticket
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f3f5" }}>
              <TableRow>
                <TableCell>Serial</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Last Reply</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket, index) => (
                  <TableRow key={ticket._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      {ticket.lastReply
                        ? new Date(ticket.lastReply).toLocaleString()
                        : "Not a reply"}
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          display: "inline-block",
                          backgroundColor:
                            ticket.status === "open" ? "#d1fae5" : "#fef3c7",
                          color:
                            ticket.status === "open" ? "#065f46" : "#92400e",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "12px",
                        }}
                      >
                        {ticket.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link to={`/user/chat/${ticket._id}`}>
                        <Button
                          variant="outlined"
                          startIcon={<RemoveRedEyeOutlined />}
                          sx={{
                            color: "#888",
                            borderColor: "#eef0f7",
                            fontSize: "10px",
                          }}
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <CustomPagination
          total={filteredTickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Create Ticket Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Create a Ticket
          </Typography>
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateTicket}
            disabled={!subject.trim()}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SupportTicket;
