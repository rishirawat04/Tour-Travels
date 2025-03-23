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
import { FilterList, RemoveRedEyeOutlined, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../Components/CustomPagination";
import first1 from "../assets/first1.jpg";
import { getAllTickets } from "../api/packagesAPI";

const OpenTicketPage = () => {
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
        const response = await getAllTickets(); // API call
        const { stats, ticketDetails } = response.data;

        const openTickets = ticketDetails.filter(
          (ticket) => ticket.status.toLowerCase() === "open"
        );

        setTicketStats(stats);
        setTicketData(openTickets);
        setFilteredData(openTickets);
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

export default OpenTicketPage;
