import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
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
import { Add, Edit, FilterList, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../Components/CustomPagination";
import {
  deletePackageById,
  getAllPackages,
  updatePackageById,
} from "../api/packagesAPI";
import { useSnackbar } from "../Components/SnackbarProvider";

const PackagePage = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [packageData, setPackageData] = useState([]);
  const [packageCardData, setPackageCardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const getPackageData = async () => {
      try {
        const packages = await getAllPackages();
        setPackageCardData(packages.data.stats);
        setPackageData(packages.data.data);
        setFilteredData(packages.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getPackageData();
  }, [showSnackbar]);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = packageData.filter((item) =>
      item.destination.toLowerCase().includes(query)
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
      setSelectedRows(filteredData.map((row) => row._id));
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
        selectedRows.map((id) => deletePackageById(id))
      );
      const messages = responses.map(
        (response) => response?.data?.message || "Review deleted successfully."
      );
      showSnackbar(messages.join(", "), "success");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting reviews:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to delete selected reviews.",
        "error"
      );
    }
  };

  // Update Review Status
  const handleUpdateStatus = async (status) => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) => updatePackageById(id, { status }))
      );
      const messages = responses.map(
        (response) =>
          response?.data?.message || "Review status updated successfully."
      );
      showSnackbar(messages.join(", "), "success");

      setSelectedRows([]);
    } catch (error) {
      console.error("Error updating review status:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to update review status.",
        "error"
      );
    }
  };

  const data = [
    {
      title: "Active Packages ",
      value: packageCardData.activePackages,
      total: packageCardData.totalPackages,
      percentage: 100,
      isPositive: true,
    },
    {
      title: "Inactive Packages ",
      value: packageCardData.inactivePackages,
      total: packageCardData.totalPackages,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Today's Created Package",
      value: packageCardData.todayCreatedPackages,
      total: packageCardData.totalPackages,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "This Month's Created Packages",
      value: packageCardData.thisMonthCreatedPackages,
      total: packageCardData.totalPackages,
      percentage: 0,
      isPositive: false,
    },
  ];

  return (
    <Box>
      <Box sx={{ border: "10px", my: 2, borderColor: "#888" }} />
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

      {/* Search and Actions */}
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
              label="Search Destinations"
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
              <>
                <Link to={"/admin/add-tour-map"}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setOpenFilterModal(true)}
                    sx={{
                      marginRight: 2,
                      color: "#888",
                      borderColor: "#eef0f7",
                      fontSize: "10px",
                    }}
                  >
                    Add Tour Map
                  </Button>
                </Link>

                <Link to={"/admin/add-package-form"}>
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    sx={{ backgroundColor: "#377dff", fontSize: "10px" }}
                  >
                    Add New
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Box>

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
                <TableCell>Package</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Start Point</TableCell>
                <TableCell>End Point</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ color: "#888" }}
                        checked={selectedRows.includes(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                      />
                    </TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.category.name}</TableCell>
                    <TableCell>{row.tourMap?.startPoint}</TableCell>
                    <TableCell>{row.tourMap?.endPoint}</TableCell>
                    <TableCell>{row.destination}</TableCell>
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
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Link to={`/admin/edit-package-form/${row._id}`}>
                        <IconButton size="small" color="#888">
                          <Edit /> Edit
                        </IconButton>
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
              {["active", "inactive"].map((status) => (
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

      {/* Filter Modal */}
      <Modal
        open={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        aria-labelledby="filter-modal"
        aria-describedby="filter-modal-description"
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 24,
            padding: 4,
            margin: "auto",
            marginTop: "15vh",
          }}
        >
          <Typography variant="h6" id="filter-modal">
            Filter Destinations
          </Typography>
          <Button
            onClick={() => setOpenFilterModal(false)}
            sx={{ marginTop: 2 }}
            fullWidth
            variant="contained"
          >
            Apply Filter
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PackagePage;
