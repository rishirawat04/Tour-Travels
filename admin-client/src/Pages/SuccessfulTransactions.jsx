import {
  Alert,
  Box,
  CircularProgress,
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
import { Search } from "@mui/icons-material";
import CustomPagination from "../Components/CustomPagination";
import { getPaymentStats } from "../api/paymentAPI";
import { useSnackbar } from "../Components/SnackbarProvider";

const SuccessfulTransactions = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPaymentStats();
        const filteredPayments = response.data.paymentLogs.filter(
          (payment) => payment.paymentVerifiedByAdmin === false
        );
        setPaymentData(filteredPayments);
        setFilteredData(filteredPayments);
        setError(null);
      } catch (error) {
        console.error("Error fetching payment data:", error.message);
        setError("Failed to fetch payment data. Please try again later.");
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
    const filtered = paymentData.filter((item) =>
      item?.transactionId?.toLowerCase().includes(query)
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

  // Loader or Error UI
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, mx: "auto", maxWidth: 600 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const data = [
    {
      title: "Total Payments",
      value: paymentData?.length || 0,
      total: paymentData?.length || 0,
      percentage: 219,
      isPositive: true,
    },
    {
      title: "Payment Success",
      value: paymentData?.filter((payment) => payment.status === "Completed")
        .length || 0,
      total: paymentData?.length || 0,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Pending Payment",
      value: paymentData?.filter((payment) => payment.status === "Pending")
        .length || 0,
      total: paymentData?.length || 0,
      percentage: 6.85,
      isPositive: false,
    },
    {
      title: "Cancel Payment",
      value: paymentData?.filter((payment) => payment.status === "Failed")
        .length || 0,
      total: paymentData?.length || 0,
      percentage: 0,
      isPositive: false,
    },
  ];

  return (
    <Box>
      <Box sx={{ border: "10px", my: 2, borderColor: "#888" }} />
      <Grid container spacing={3}>
        {data?.map((item, index) => (
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
              label="Search Transaction ID"
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

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f3f5" }}>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Transaction Id
                </TableCell>
                <TableCell>Tourist</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payable Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row?.transactionId}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography>
                          {row.touristName}
                          <Typography
                            style={{ color: "#888", fontSize: "12px" }}
                          >
                            {row.Email}
                          </Typography>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row?.method}</TableCell>
                    <TableCell>{row?.amount?.$numberDecimal}</TableCell>
                    <TableCell>{row?.payableAmount?.$numberDecimal}</TableCell>
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
                        {row?.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(row?.date).toLocaleDateString()}
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
    </Box>
  );
};

export default SuccessfulTransactions;
