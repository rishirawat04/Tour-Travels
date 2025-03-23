import {
  Box,
  Button,
  Checkbox,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import StatisticCard from "../Components/StatisticCard";
import { RemoveRedEyeOutlined, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../Components/CustomPagination";

import { getAllTickets } from "../api/packagesAPI";
import { useSnackbar } from "../Components/SnackbarProvider";
import { changeTicketStatus, DeleteTicket } from "../api/userAPI";

const AllTicketPage = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketData, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ticketStats, setTicketStats] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Fetch ticket data and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTickets(); 
        const { stats, ticketDetails } = response.data;

        setTicketStats(stats);
        setTicketData(ticketDetails);
        setFilteredData(ticketDetails);
      } catch (error) {
        console.error("Error fetching tickets:", error.message);
      }
    };

    fetchData();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = ticketData.filter((item) =>
      item.subject.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  // Handle Pagination
  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Handle Row Selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredData.map((row) => row.ticketId));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Open Confirmation Modal
  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  // Delete Selected Reviews
  const handleDeleteSelected = async () => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) => DeleteTicket(id))
      );
      const messages = responses.map(
        (response) => response?.data?.message || "Ticket deleted successfully."
      );
      showSnackbar(messages.join(", "), "success");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to delete selected ticket.",
        "error"
      );
    }
  };

  // Update Review Status
  const handleUpdateStatus = async (status) => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) => changeTicketStatus(id,{  status }))
      );
      const messages = responses.map(
        (response) =>
          response?.data?.message || "Ticket status updated successfully."
      );
      showSnackbar(messages.join(", "), "success");

      setSelectedRows([]);
    } catch (error) {
      console.error("Error updating ticker status:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to update Ticket status.",
        "error"
      );
    }
  };

  // Stats Data
  const data = [
    {
      title: "Open Tickets",
      value: ticketStats.totalOpenTickets,
      total: ticketStats.totalTickets,
      percentage: 84.93,
      isPositive: true,
    },
    {
      title: "Closed Tickets",
      value: ticketStats.totalClosedTickets,
      total: ticketStats.totalTickets,
      percentage: 15.07,
      isPositive: false,
    },
    {
      title: "Today's Tickets",
      value: ticketStats.totalTodaysTickets,
      total: ticketStats.totalTickets,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Total Tickets",
      value: ticketStats.totalTickets,
      total: ticketStats.totalTickets,
      percentage: 100,
      isPositive: false,
    },
  ];

  return (
    <Box>
      {/* Statistic Cards */}
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatisticCard
              title={item.title}
              value={item.value}
              total={item.total}
              percentage={item.percentage}
              isPositive={item.isPositive}
            />
          </Grid>
        ))}
      </Grid>

      {/* Search and Table */}
      <Box component={Paper} sx={{ bgcolor: "#fff", mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Search Box */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search by Subject"
              variant="standard"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search sx={{ ml: 1, color: "gray" }} />
          </Box>

          <Box>
            {selectedRows.length > 0 ? (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#d32f2f",
                    marginRight: 2,
                    fontSize: "10px",
                  }}
                  onClick={() => openModal("delete")}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#1976d2", fontSize: "10px" }}
                  onClick={() => openModal("status")}
                >
                  Change Status
                </Button>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>

        {/* Tickets Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < filteredData.length
                    }
                    checked={selectedRows.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Reply</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(ticket.ticketId)}
                        onChange={() => handleSelectRow(ticket.ticketId)}
                      />
                    </TableCell>
                    <TableCell>{ticket.ticketId}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {ticket.lastReply
                        ? new Date(ticket.lastReply).toLocaleString()
                        : "No Replies"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Link to={`/admin/support-ticket/${ticket.ticketId}`}>
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
          total={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Confirmation Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {modalType === "delete"
              ? "Are you sure you want to delete the selected rows?"
              : "Select a status to apply to the selected rows:"}
          </Typography>

          {modalType === "status" && (
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {["open", "closed"].map((status) => (
                <Button
                  key={status}
                  variant="outlined"
                  onClick={() => {
                    handleUpdateStatus(status);
                    closeModal();
                  }}
                >
                  {status}
                </Button>
              ))}
            </Box>
          )}

          {modalType === "delete" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDeleteSelected();
                  closeModal();
                }}
                variant="contained"
                color="error"
              >
                Confirm
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

 
    </Box>
  );
};

export default AllTicketPage;
