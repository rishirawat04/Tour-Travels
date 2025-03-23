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
import first1 from "../assets/first1.jpg";
import {
  deleteBookedTour,
  getBookedTourStats,
  updateBookedTourStatus,
} from "../api/paymentAPI";
import { useSnackbar } from "../Components/SnackbarProvider";
import LoaderPage from "../Components/LoaderPage";

const AllTourPage = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [bookedTourCardData, setBookedTourCardData] = useState([]);
  const [bookedData, setBookedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getBookedTourStats();
        if (response.data.success) {
          const statistics = response.data.statistics;
          setBookedTourCardData([
            {
              title: "Completed Tour",
              value: statistics.completedTours,
              total: statistics.completedTours + statistics.pendingTours,
              percentage:
                (statistics.completedTours /
                  (statistics.completedTours + statistics.pendingTours)) *
                100,
              isPositive: true,
            },
            {
              title: "Pending Tour",
              value: statistics.pendingTours,
              total: statistics.completedTours + statistics.pendingTours,
              percentage:
                (statistics.pendingTours /
                  (statistics.completedTours + statistics.pendingTours)) *
                100,
              isPositive: false,
            },
            {
              title: "Today's Total Booking",
              value: statistics.todayBookedTours,
              total: statistics.todayBookedTours,
              percentage: 100,
              isPositive: true,
            },
            {
              title: "Tours Not Verified By Admin",
              value: statistics.toursNotVerifiedByAdmin,
              total: statistics.toursNotVerifiedByAdmin,
              percentage:
                (statistics.toursNotVerifiedByAdmin /
                  statistics.todayBookedTours) *
                100,
              isPositive: false,
            },
          ]);
          setBookedData(response.data.statistics.details);
          setFilteredData(response.data.statistics.details);
        } else {
          setError("Failed to load tour data.");
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = bookedData.filter((item) =>
      item.packageTitle.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  // Handle Pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

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

  // Delete Selected Booked Tours
  const handleDeleteSelected = async () => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) => deleteBookedTour(id))
      );
      const messages = responses.map(
        (response) =>
          response?.data?.message || "Booked tour deleted successfully."
      );
      showSnackbar(messages.join(", "), "success");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting booked tour:", error);
      showSnackbar(
        error?.response?.data?.message ||
          "Failed to delete selected booked tours.",
        "error"
      );
    }
  };

  // Update Booked Tour Status
  const handleUpdateStatus = async (status) => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) =>
          updateBookedTourStatus({ newStatus: status, tourId: id })
        )
      );
      const messages = responses.map(
        (response) =>
          response?.data?.message ||
          `Booked tour status updated to ${status} successfully.`
      );
      showSnackbar(messages.join(", "), "success");

      setSelectedRows([]);
    } catch (error) {
      console.error("Error updating booked tour status:", error);
      showSnackbar(
        error?.response?.data?.message ||
          "Failed to update status of selected booked tours.",
        "error"
      );
    }
  };

  return (
    <Box>
      <Box sx={{ border: "10px", my: 2, borderColor: "#888" }} />
      <Grid container spacing={3}>
        {bookedTourCardData.map((item, index) => (
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

      {/* Search and Actions Table */}
      <Box component={Paper} sx={{ bgcolor: "#fff", mt: 4 }}>
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
              label="Search Packages"
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

        {loading ? (
          <Typography>
            <LoaderPage />
          </Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f1f3f5" }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      sx={{ color: "#888" }}
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < filteredData.length
                      }
                      checked={selectedRows.length === filteredData.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Booking Id</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Tourist</TableCell>
                  <TableCell>Package</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Booking At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.bookingId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ color: "#888" }}
                          checked={selectedRows.includes(row.bookingId)}
                          onChange={() => handleSelectRow(row.bookingId)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={first1}
                            alt={row.packageTitle}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                          {row.bookingId}
                        </Box>
                      </TableCell>
                      <TableCell>{row.bookingDate}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.packageTitle}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            display: "inline-block",
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            fontSize: "12px",
                          }}
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(row.bookingDate).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Link to={`/admin/booking-details/${row.bookingId}`}>
                          <Button
                            variant="outlined"
                            startIcon={<RemoveRedEyeOutlined />}
                            sx={{
                              color: "#888",
                              borderColor: "#eef0f7",
                              fontSize: "10px",
                              whiteSpace: "nowrap",
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
        )}

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
              {["Upcoming", "Completed", "Cancelled", "Expired"].map(
                (status) => (
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
                )
              )}
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

export default AllTourPage;
