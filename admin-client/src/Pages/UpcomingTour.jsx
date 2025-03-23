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
import React, { useState } from "react";
import StatisticCard from "../Components/StatisticCard";
import {
  Add,
  FilterList,
  RemoveRedEyeOutlined,
  Search,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../Components/CustomPagination";
import first1 from "../assets/first1.jpg";

const data = [
  {
    title: "Completed Tour",
    value: 14,
    total: 14,
    percentage: 100,
    isPositive: true,
  },
  {
    title: "Pending Tour",
    value: 0,
    total: 14,
    percentage: 0,
    isPositive: false,
  },
  {
    title: "Today's Total Booking",
    value: 0,
    total: 14,
    percentage: 0,
    isPositive: false,
  },
  {
    title: "This Month's Tour",
    value: 0,
    total: 14,
    percentage: 0,
    isPositive: false,
  },
];

const destinationsData = [
  {
    id: 1,
    packages: "Maldives 3 Days 2 Nights",
    Duration: "3 days 2 nights",
    price: "$499",
    Tourist: "Rocky Singh",
    Email: "raw@rocky.gamil.com",
    status: "Upcoming",
    BookingDate: "16/09/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 2,
    packages: "Paris 5 Days 4 Nights",
    Duration: "5 days 4 nights",
    price: "$1299",
    Tourist: "Sophia Lee",
    Email: "sophia.lee@gmail.com",
    status: "Completed",
    BookingDate: "12/08/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 3,
    packages: "Bali 4 Days 3 Nights",
    Duration: "4 days 3 nights",
    price: "$899",
    Tourist: "John Carter",
    Email: "john.carter@hotmail.com",
    status: "Cancelled",
    BookingDate: "25/07/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 4,
    packages: "Dubai 7 Days 6 Nights",
    Duration: "7 days 6 nights",
    price: "$1999",
    Tourist: "Ayesha Khan",
    Email: "ayesha.khan@live.com",
    status: "Upcoming",
    BookingDate: "03/11/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 5,
    packages: "Switzerland 6 Days 5 Nights",
    Duration: "6 days 5 nights",
    price: "$2499",
    Tourist: "Rajesh Mehta",
    Email: "rajesh.mehta@gmail.com",
    status: "Completed",
    BookingDate: "18/06/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 6,
    packages: "Thailand 5 Days 4 Nights",
    Duration: "5 days 4 nights",
    price: "$599",
    Tourist: "Emily Watson",
    Email: "emily.watson@yahoo.com",
    status: "Upcoming",
    BookingDate: "10/12/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 7,
    packages: "Australia 8 Days 7 Nights",
    Duration: "8 days 7 nights",
    price: "$2999",
    Tourist: "Peter Parker",
    Email: "peter.parker@stark.com",
    status: "Cancelled",
    BookingDate: "05/05/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 8,
    packages: "New Zealand 9 Days 8 Nights",
    Duration: "9 days 8 nights",
    price: "$3499",
    Tourist: "Linda Brown",
    Email: "linda.brown@icloud.com",
    status: "Completed",
    BookingDate: "15/09/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 9,
    packages: "Singapore 3 Days 2 Nights",
    Duration: "3 days 2 nights",
    price: "$799",
    Tourist: "Arun Patel",
    Email: "arun.patel@gmail.com",
    status: "Upcoming",
    BookingDate: "20/10/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 10,
    packages: "Japan 7 Days 6 Nights",
    Duration: "7 days 6 nights",
    price: "$2799",
    Tourist: "Hana Yuki",
    Email: "hana.yuki@gmail.com",
    status: "Upcoming",
    BookingDate: "30/11/2024",
    BookingAt: "14/09/2024",
  },
  {
    id: 11,
    packages: "Canada 10 Days 9 Nights",
    Duration: "10 days 9 nights",
    price: "$3999",
    Tourist: "Michael Scott",
    Email: "michael.scott@dundermifflin.com",
    status: "Cancelled",
    BookingDate: "08/04/2024",
    BookingAt: "14/09/2024",
  },
];

const UpcomingTour = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(destinationsData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = destinationsData.filter((item) =>
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
      setSelectedRows(filteredData.map((row) => row.id));
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

      {/* Search and Actions Table*/}
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
                  Filter
                </Button>
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
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{ color: "#888" }}
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={first1}
                          alt={row.packages}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            marginRight: "8px",
                          }}
                        />
                        {row.id}
                      </Box>
                    </TableCell>
                    <TableCell>{row.BookingDate}</TableCell>
                    <TableCell>{row.Duration}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.Tourist}</TableCell>
                    <TableCell>{row.packages}</TableCell>
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
                    <TableCell>{row.BookingAt}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Link to={"/admin/add-package-form"}>
                        <Button
                          variant="outlined"
                          startIcon={<RemoveRedEyeOutlined />}
                          onClick={() => setOpenFilterModal(true)}
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
              : "Are you sure you want to change the status of the selected rows?"}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={closeModal} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={closeModal}
              variant="contained"
              color={modalType === "delete" ? "error" : "primary"}
            >
              Confirm
            </Button>
          </Box>
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

export default UpcomingTour;
