import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Paper,
  Menu,
  IconButton,
  MenuItem,
  Skeleton,
} from "@mui/material";

import Person2Icon from "@mui/icons-material/Person2";
import CallIcon from "@mui/icons-material/Call";
import { Email } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useParams } from "react-router-dom";
import { useSnackbar } from "./SnackbarProvider";
import {
  getTourDetailsByUserId,
  updateBookedTourStatus,
} from "../api/paymentAPI";

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState("Expired");
  const [bookingData, setBookingData] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (newStatus) => {
    setAnchorEl(null);
    if (newStatus) {
      await handleUpdateStatus(newStatus);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await updateBookedTourStatus({ newStatus, bookingId });

      const message =
        response?.data?.message ||
        `Booked tour status updated to ${newStatus} successfully.`;

      showSnackbar(message, "success");
    } catch (error) {
      console.error("Error updating booked tour status:", error);
      showSnackbar(
        error?.response?.data?.message ||
          "Failed to update the booked tour status.",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getTourDetailsByUserId(bookingId);
        console.log(response, "Tour details");

        setBookingData(response.data.data);
      } catch (error) {
        showSnackbar(
          error.response?.data?.message || "Failed to load data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, showSnackbar]);

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={3}>
          {/* User Information */}
          {loading ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : (
            <Card sx={{ marginBottom: 2, borderRadius: "10px" }}>
              <Box
                sx={{
                  px: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: 1,
                  borderColor: "#eef0f7",
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={bookingData?.user.profile}
                    alt={"img"}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />{" "}
                  <p>{bookingData?.user.name}</p>
                </Typography>
                <Link to={`/admin/profile/${bookingData?.user.userId}/user`}>
                  <Button
                    variant="text"
                    sx={{
                      color: "#00c9a7",
                      textTransform: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View Profile
                  </Button>
                </Link>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography sx={{ color: "#888", fontSize: "14px" }}>
                  ABOUT
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, display: "flex", alignItems: "center" }}
                >
                  <Person2Icon
                    sx={{ color: "#888", fontSize: "24px", mr: 1 }}
                  />{" "}
                  {bookingData?.user.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, display: "flex", alignItems: "center" }}
                >
                  <Email sx={{ color: "#888", fontSize: "24px", mr: 1 }} />{" "}
                  {bookingData?.user.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#007BFF",
                    marginTop: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MenuIcon sx={{ color: "#888", fontSize: "24px", mr: 1 }} />
                  {bookingData?.user.previousBookings}
                  Previous Booking
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 1, display: "flex", alignItems: "center" }}
                >
                  <CallIcon sx={{ color: "#888", fontSize: "24px", mr: 1 }} />{" "}
                  {bookingData?.user.phone}
                </Typography>
              </Box>
            </Card>
          )}

          {/* Payment Information */}
          {loading ? (
            <Skeleton />
          ) : (
            <Card sx={{ borderRadius: "10px" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ px: 2, py: 1.2, borderBottom: 1, borderColor: "#eef0f7" }}
              >
                Payment Information
              </Typography>

              {/* Transaction Details Box */}
              <Box sx={{ p: 2 }}>
                <Typography sx={{ color: "#888", fontSize: "14px" }}>
                  TRANSACTION DETAILS
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2, // Add margin-top for spacing
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Booking ID:</p> <p>{bookingData?.payment.bookingId}</p>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "#ed4c78" }}>
                    Charge In Payment Currency:
                  </p>{" "}
                  <p>{bookingData?.payment.totalAmount?.$numberDecimal} INR</p>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Paid In Payment Currency:</p>{" "}
                  <p>{bookingData?.payment.paidAmount?.$numberDecimal} INR</p>
                </Typography>
              </Box>

              {/* Coupon Information Box */}
              <Box sx={{ p: 2 }}>
                <Typography sx={{ color: "#888", fontSize: "14px" }}>
                  COUPON INFORMATION
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2, // Consistent margin-top
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Amount:</p>{" "}
                  <p>{bookingData?.payment.discountAmount?.$numberDecimal}</p>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2, // Consistent margin-top
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Coupon Apply:</p>{" "}
                  <p>{bookingData?.payment.couponApplied}</p>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Coupon:</p> <p>{bookingData?.payment.couponCode}</p>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2, // Consistent margin-top
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "#ed4c78" }}>Discount Amount:</p>{" "}
                  <p>{bookingData?.payment.discountAmount?.$numberDecimal}</p>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: 1,
                    borderColor: "#eef0f7",
                  }}
                >
                  <p>Final Amount:</p>{" "}
                  <p>{bookingData?.payment.paidAmount?.$numberDecimal}</p>
                </Typography>
              </Box>
            </Card>
          )}
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={9}>
          <Card sx={{ marginBottom: 2, borderRadius: "10px" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2, py: 1.5, border: 1, borderColor: "#eef0f7" }}
            >
              <Typography variant="h6" fontWeight="bold">
                Booking Information
              </Typography>
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color={status === "Expired" ? "error" : "success"}
                  sx={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    backgroundColor:
                      status === "Expired"
                        ? "#f8d7da"
                        : status === "Complete"
                        ? "#d4edda"
                        : "#fff3cd",
                    display: "inline-block",
                  }}
                >
                  {status}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleClick}
                  sx={{ padding: 0 }}
                >
                  <ArrowDropDownIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => handleClose(null)}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 120,
                    },
                  }}
                >
                  <MenuItem onClick={() => handleClose("Complete")}>
                    Complete
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("Upcoming")}>
                    Upcoming
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("Cancelled")}>
                    Cancelled
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("Expired")}>
                    Cancelled
                  </MenuItem>
                </Menu>
              </Box> */}
            </Box>
            <Paper sx={{ p: 2, m: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Package Title:
                  </Typography>
                  <Typography variant="body1">
                    {bookingData?.package.title || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Total Price:
                  </Typography>
                  <Typography variant="body1">{`${
                    bookingData?.package.price || "N/A"
                  } INR`}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Booking ID:
                  </Typography>
                  <Typography variant="body1">
                    {bookingData?.bookingId || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Start Date:
                  </Typography>
                  <Typography variant="body1">
                    {bookingData?.package.startDate
                      ? new Date(
                          bookingData.package.startDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Destination:
                  </Typography>
                  <Typography variant="body1">
                    {bookingData?.package.destination || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Duration:
                  </Typography>
                  <Typography variant="body1">
                    {bookingData?.package.duration || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Tour Type:
                  </Typography>
                  <Typography variant="body1">
                    {bookingData?.package.tourType || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingDetailsPage;
