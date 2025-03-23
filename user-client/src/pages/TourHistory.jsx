import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { RemoveRedEyeOutlined, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../components/CustomPagination";
import { getOrderDetials } from "../api/paymentAPI";
import { useSelector } from "react-redux";

const TourHistory = () => {
  const { userId } = useSelector((state) => state.auth);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await getOrderDetials(userId);

        if (response.data.success) {
          const orders = response.data.data.orders.map((order) => ({
            orderId: order.orderId,
            destination: order.package.destination,
            pricePerPerson: order.package.pricePerPerson,
            totalAmount: order.totalAmount,
            quantity: order.quantity,
            tourDate: order.tourDate,
            status: order.status,
          }));
          setOrderDetails(orders);
          setFilteredData(orders);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [userId]);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orderDetails.filter((item) =>
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
      setSelectedRows(filteredData.map((row) => row.orderId));
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

  return (
    <Box>
      <Box sx={{ border: "10px", my: 2, borderColor: "#888" }} />

      {/* Search and Actions Table */}
      <Box component={Paper} sx={{ bgcolor: "#fff", mt: 4 }}>
        <Typography sx={{ fontSize: "25px", p: 1 }}>Tours History</Typography>
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
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredData.length > 0 ? (
          <>
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
                    <TableCell>Destination</TableCell>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell>Total Persons</TableCell>
                    <TableCell>Tour Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.orderId}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{ color: "#888" }}
                            checked={selectedRows.includes(row.orderId)}
                            onChange={() => handleSelectRow(row.orderId)}
                          />
                        </TableCell>
                        <TableCell>{row.orderId}</TableCell>
                        <TableCell>{row.destination}</TableCell>
                        <TableCell>{row.totalAmount}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>
                          {new Date(row.tourDate).toLocaleDateString()}
                        </TableCell>
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
                          <Link to={`/admin/booking-details/${row.orderId}`}>
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
          </>
        ) : (
          <Typography
            sx={{ textAlign: "center", padding: "20px", color: "gray" }}
          >
            No orders found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TourHistory;
