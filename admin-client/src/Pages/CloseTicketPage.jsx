import {
  Box,
  Button,
  Checkbox,
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
import { Search } from "@mui/icons-material";
import CustomPagination from "../Components/CustomPagination";
import { getAllTickets } from "../api/packagesAPI";

const CloseTicketPage = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketData, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Fetch ticket data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTickets(); 
        const { ticketDetails } = response.data;

       
        const closedTickets = ticketDetails.filter(
          (ticket) => ticket.status.toLowerCase() === "closed"
        );

        setTicketData(closedTickets);
        setFilteredData(closedTickets);
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

  // Pagination
  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Row Selection
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

  // Modal Controls
  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  return (
    <Box>
      {/* Title */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Closed Tickets
      </Typography>

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
        <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2 }}>
          <Typography variant="h6">
            {modalType === "delete"
              ? "Are you sure you want to delete the selected rows?"
              : "Are you sure you want to change the status of the selected rows?"}
          </Typography>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button color="error" onClick={closeModal}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CloseTicketPage;
