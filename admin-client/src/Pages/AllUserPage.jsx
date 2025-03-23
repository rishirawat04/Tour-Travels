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
import { Edit, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../Components/CustomPagination";
import first1 from "../assets/first1.jpg";
import { getAllUsers } from "../api/dashboardAPI";
import { useSnackbar } from "../Components/SnackbarProvider";
import { deleteUser, updateUser } from "../api/userAPI";


const AllUserPage = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUserCardData, setAllUserCardData] = useState({});
  const [userData, setUserData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Fetch user data
  const fetchUserData = async (query = "") => {
    try {
      const response = await getAllUsers(query);
      setAllUserCardData(response.data.stats);
      setUserData(response.data.data);
    } catch (error) {
      console.log("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.trim();
    setSearchQuery(query);
    fetchUserData(query);
  };

  // Handle Pagination
  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Handle Row Selection
  const handleSelectAll = (event) => {
    setSelectedRows(event.target.checked ? userData.map((row) => row.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Delete Selected Reviews
  const handleDeleteSelected = async () => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) => deleteUser(id))
      );
      const messages = responses.map(
        (response) => response?.data?.message || "User deleted successfully."
      );
      showSnackbar(messages.join(", "), "success");
      setSelectedRows([]);
    } catch (error) {
      console.error("Error deleting reviews:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to delete selected User.",
        "error"
      );
    }
  };

  // Update Review Status
  const handleUpdateStatus = async (status) => {
    try {
      const responses = await Promise.all(
        selectedRows.map((id) => updateUser(id, { status }))
      );
      const messages = responses.map(
        (response) =>
          response?.data?.message || "User status updated successfully."
      );
      showSnackbar(messages.join(", "), "success");

      setSelectedRows([]);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to update user status.",
        "error"
      );
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

  const data = [
    { title: "Total Users", value: allUserCardData.totalUsers || 0 },
    { title: "Active Users", value: allUserCardData.totalActiveUsers || 0 },
    {
      title: "Today Joined",
      value: allUserCardData.totalTodayJoinedUsers || 0,
    },
    {
      title: "Deactivated Users",
      value: allUserCardData.totalDeactivatedUsers || 0,
    },
  ];

  return (
    <Box>
      {/* Statistic Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatisticCard title={item.title} value={item.value} />
          </Grid>
        ))}
      </Grid>

      {/* Search and Actions */}
      <Box component={Paper} sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search Users"
              variant="standard"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{ endAdornment: <Search /> }}
            />
          </Box>
           <Box>
                 {selectedRows.length > 0 ? (
                   <>
                     <Button
                       variant="contained"
                       color="error"
                       onClick={() => openModal("delete")}
                       sx={{ mr: 2 }}
                     >
                       Delete
                     </Button>
                     <Button
                       variant="contained"
                       color="primary"
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
      </Box>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedRows.length === userData.length}
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < userData.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email - Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onChange={() => handleSelectRow(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.firstname}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            marginRight: 8,
                          }}
                        />
                      ) : (
                        <img
                          src={first1}
                          alt="default"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            marginRight: 8,
                          }}
                        />
                      )}
                      {user.firstname} {user.lastname}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.email} - {user.phonenumber}
                  </TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Link to={`/admin/profile/${user.id}/user`}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                    
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

      {/* Pagination */}
      <CustomPagination
        total={userData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
              {["active", "deactived"].map((status) => (
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

export default AllUserPage;
