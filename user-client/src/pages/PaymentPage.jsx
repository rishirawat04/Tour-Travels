import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RemoveRedEyeOutlined, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../components/CustomPagination";
import { getPaymentDetials } from "../api/paymentAPI";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const { userId } = useSelector((state) => state.auth);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const response = await getPaymentDetials(userId);
        setPaymentDetails(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [userId]);

  useEffect(() => {
    const filtered = paymentDetails.filter(
      (item) =>
        item.transactionId.toLowerCase().includes(searchQuery) ||
        item.method.toLowerCase().includes(searchQuery)
    );
    setFilteredData(filtered);
  }, [searchQuery, paymentDetails]);

  // Handle Search
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
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
      setSelectedRows(filteredData.map((row) => row.transactionId));
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
        <Typography sx={{ fontSize: "25px", p: 1 }}>Payment Logs</Typography>
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
              label="Search Payments"
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
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 5 }}>
            No Data Found
          </Typography>
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
                  <TableCell>Transaction Id</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Booking At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.transactionId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ color: "#888" }}
                          checked={selectedRows.includes(row.transactionId)}
                          onChange={() => handleSelectRow(row.transactionId)}
                        />
                      </TableCell>
                      <TableCell>{row.transactionId}</TableCell>
                      <TableCell>{row.method}</TableCell>
                      <TableCell>₹{row.amount}</TableCell>
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
                        {new Date(row.bookingAt).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Link to={row.action}>
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
        {!loading && filteredData.length > 0 && (
          <CustomPagination
            total={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Box>
    </Box>
  );
};

export default PaymentPage;
