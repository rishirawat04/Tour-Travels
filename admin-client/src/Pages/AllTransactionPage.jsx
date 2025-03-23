import {
  Alert,
  Box,
  Button,
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
import { Edit, Search } from "@mui/icons-material";
import CustomPagination from "../Components/CustomPagination";
import PaymentInfoModal from "../Components/PaymentModel";
import { getPaymentStats, updatePaymentByAdmin } from "../api/paymentAPI";
import { useSnackbar } from "../Components/SnackbarProvider";

const AllTransactionPage = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [paymentData, setPaymentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paymentCardData, setPaymentCardData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(""); 
  const [transactionId, setTransactionId] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPaymentStats();
        setPaymentCardData(response.data);
        setPaymentData(response.data.paymentLogs);
        setFilteredData(response.data.paymentLogs);
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

  // Handle Open Modal
  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setOrderId(payment?.orderId || ""); 
    setTransactionId(payment?.transactionId || ""); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderId(""); 
    setTransactionId(""); 
  };

  // Handle Verify Payment
  const handleVerifyPayment = async () => {
    if (!orderId || !transactionId) return;

    try {
      const response = await updatePaymentByAdmin({
        orderId,
        paymentId:transactionId,
      });
   
      showSnackbar(response.data.message || "Verify Payment response:", "success");
      setIsModalOpen(false); 
    } catch (error) {
      console.error("Error in verifying payment:", error.message);
      showSnackbar(error.response.data.message || " failed to Verify Payment response:", "error");
    }
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
      value: paymentCardData?.counts?.totalPayments || 0,
      total: paymentCardData?.counts?.totalPayments || 0,
      percentage: 219,
      isPositive: true,
    },
    {
      title: "Payment Success",
      value: paymentCardData?.counts?.successPayments || 0,
      total: paymentCardData?.counts?.totalPayments || 0,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Pending Payment",
      value: paymentCardData?.counts?.pendingPayments || 0,
      total: paymentCardData?.counts?.totalPayments || 0,
      percentage: 6.85,
      isPositive: false,
    },
    {
      title: "Cancel Payment",
      value: paymentCardData?.counts?.failedPayments || 0,
      total: paymentCardData?.counts?.totalPayments || 0,
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
                <TableCell>Action</TableCell>
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
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleOpenModal(row)}
                        sx={{
                          color: "#888",
                          borderColor: "#eef0f7",
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Edit
                      </Button>
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

      {/* Modal for verifying payment */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            width: "400px",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Verify the Payment
          </Typography>
          <TextField
            label="Order ID"
            variant="outlined"
            fullWidth
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Transaction ID"
            variant="outlined"
            fullWidth
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={handleVerifyPayment}>
              Verify
            </Button>
            <Button variant="outlined" onClick={closeModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllTransactionPage;
