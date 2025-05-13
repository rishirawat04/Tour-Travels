import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  ImageListItem,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Remove, AccessTime, Category, Group } from "@mui/icons-material"; // Added icons
import hero from "../assets/hero.jpg";

import HeaderPage from "./HeaderPage";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useSnackbar } from "./SnackbarProvider";
import FooterPage from "./FooterPage";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageDetail } from "../api/TopDestinationApi";
import { applyCoupon, createOrder, verifyOrder } from "../api/paymentAPI";
import { useSelector } from "react-redux";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const PackageDetails = () => {
  const { showSnackbar } = useSnackbar();
  const { name, email, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { packageId } = useParams();
  const [selectedImage, setSelectedImage] = useState(hero);
  const [adultCount, setAdultCount] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [packageDetails, setPackageDetails] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    const getDetails = async () => {
      try {
        const data = await getPackageDetail(packageId);

        setPackageDetails(data);

        // Ensure images array exists and is not empty
        if (data?.images?.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          console.warn("No images found for this package.");
        }
      } catch (error) {
        console.error("Error fetching package details:", error.message);
      }
    };
    getDetails();
  }, [packageId]);

  const handleQuantityChange = (type, operation) => {
    if (type === "adult") {
      setAdultCount(
        operation === "increment" ? adultCount + 1 : Math.max(adultCount - 1, 0)
      );
    }
  };

  const calculateTotal = () => {
    return adultCount * (packageDetails?.price || 0);
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString("en-GB");
  };

  const handleApplyCoupon = async () => {
    setLoading(true);
    try {
      const cartAmount = calculateTotal();
      const trimmedCode = couponCode.trim(); 
  
    
      if (!trimmedCode) {
        showSnackbar("Coupon code cannot be empty", "error");
        setLoading(false);
        return;
      }
  
      if (cartAmount <= 0) {
        showSnackbar("Cart amount must be greater than zero", "error");
        setLoading(false);
        return;
      }
  
    
      const response = await applyCoupon({ code: trimmedCode, cartAmount });
  
      if (response.data.success) {
        setFinalAmount(response.data.finalAmount);
        showSnackbar(
          response.data.message || "Coupon applied successfully",
          "success"
        );
      } else {
        showSnackbar(response.data.message || "Failed to apply coupon", "error");
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Error applying coupon",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }

    const totalAmount = finalAmount || calculateTotal();
    
    try {
      // Create order in backend
      const response = await createOrder({
        packageId: packageDetails._id,
        totalAmount,
        quantity: adultCount,
        discountCode: couponCode,
      });

      if (response.data.success) {
        const razorpayOptions = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_nAdl50PadmvUWT',
          amount: response.data.amount, 
          currency: response.data.currency,
          name: 'RishiTech04',
          description: 'Our Aim to provide best services',
          order_id: response.data.razorpayOrderId,
          handler: async (razorpayResponse) => {
            try {
              // Verify the payment after successful Razorpay response
              const verificationResponse  = await verifyOrder({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              });
   
              if (verificationResponse.data.success) {
                showSnackbar(verificationResponse.data.message || "Payment successful", "success");
              } else {
                showSnackbar("Payment verification failed", "error");
              }
            } catch (error) {
              if (error.isAuthError) {
                showSnackbar(error.message, "error");
                // Redirect to login page
                navigate('/login');
              } else {
                showSnackbar(error.message || 'Error verifying payment', 'error');
              }
            }
          },
          prefill: {
            name: name || '', 
            email: email || '',
          },
          theme: {
            color: "#18a19a",
          },
        };
  
        if (window.Razorpay) {
          const razorpayInstance = new window.Razorpay(razorpayOptions);
          razorpayInstance.open();
        } else {
          showSnackbar("Razorpay SDK not loaded", "error");
        }
      }
    } catch (error) {
      if (error.isAuthError) {
        showSnackbar(error.message || "Please login to continue with booking", "error");
        // Show login dialog instead of immediate redirect
        setShowLoginDialog(true);
      } else {
        showSnackbar(error.message || 'Error creating order', 'error');
      }
    }
  };
  
  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    // Save current page to localStorage so we can redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate('/signin');
  };
  
  const handleDialogClose = () => {
    setShowLoginDialog(false);
  };

  return (
    <Box sx={{ backgroundColor: "#f9f8eb", minHeight: "100vh" }}>
      <HeaderPage />
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={hero}
          sx={{
            width: "100%",
            height: "350px",
            borderRadius: "8px",
            objectFit: "cover",
            filter: "brightness(0.8)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "1001",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Typography sx={{ fontSize: "2rem" }}>Packages</Typography>
            <Typography sx={{ fontSize: "1.7rem", whiteSpace: "nowrap" }}>
              Home {">"} Packages
            </Typography>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ p: 4 }}>
        {/* Left Section */}
        <Grid item xs={12} md={8} sx={{ paddingRight: 2 }}>
          {/* Main Image */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={selectedImage}
              alt="Selected"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: { xs: "300px", sm: "400px", md: "500px" },
                objectFit: "cover",
                borderRadius: 2,
                overflow: "hidden",
              }}
            />
          </Box>
          {/* Thumbnails */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: 2,
            }}
          >
            {packageDetails?.images?.length > 0 ? (
              packageDetails?.images?.map((img, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 4,
                    overflow: "hidden",
                    border:
                      selectedImage === img ? "2px solid #147d78" : "none",
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </ImageListItem>
              ))
            ) : (
              <Typography>No images available</Typography>
            )}
          </Box>

          {/* Tour Details */}
          <Typography variant="h5">
            {packageDetails?.title || "Loading..."}
          </Typography>
          {/* Tour Details */}
          <Typography
            variant="h5"
            color="textSecondary"
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <span> Price: ₹{packageDetails?.price || "Loading..."} </span>
            <span
              style={{
                marginLeft: 10,
                fontSize: "15px",
                marginTop: 4,
                textDecoration: "line-through",
                color: "red",
              }}
            >
              {packageDetails?.discountPrice || "Loading..."}{" "}
            </span>
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {packageDetails?.destination || "Loading..."}
          </Typography>
          <Grid container spacing={6} my={2}>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#fde8c9",
                  p: 1,
                  borderRadius: 2,
                }}
              >
                <AccessTime sx={{ color: "#147d78", fontSize: "2rem" }} />
                <Box>
                  <Typography variant="h6">Duration</Typography>
                  <Typography color="textSecondary">
                    {packageDetails?.duration}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  backgroundColor: "#fde8c9",
                  borderRadius: 2,
                }}
              >
                <Category sx={{ color: "#147d78", fontSize: "2rem" }} />
                <Box>
                  <Typography variant="h6">Tour Type</Typography>
                  <Typography color="textSecondary">
                    {packageDetails?.tourType}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  backgroundColor: "#fde8c9",
                  borderRadius: 2,
                }}
              >
                <Group sx={{ color: "#147d78", fontSize: "2rem" }} />
                <Box>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    Min Travelers
                  </Typography>
                  <Typography color="textSecondary" sx={{ ml: 6 }}>
                    {packageDetails?.minTravelers}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  backgroundColor: "#fde8c9",
                  borderRadius: 2,
                }}
              >
                <Group sx={{ color: "#147d78", fontSize: "2rem" }} />
                <Box>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    Max Travelers
                  </Typography>
                  <Typography color="textSecondary" sx={{ ml: 6 }}>
                    {packageDetails?.maxTravelers}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Overview */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#8ed1c1",
              },
              "& .MuiTab-root": {
                color: "#147d78",
              },
              "& .Mui-selected": {
                color: "#8ed1c1",
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Included" />
            <Tab label="Tour Map" />
          </Tabs>

          {/* Tab Panels */}
          {selectedTab === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Overview
              </Typography>
              <Typography variant="body1" mt={2}>
                {packageDetails?.overview?.description ||
                  "No overview available."}
              </Typography>
              <Typography variant="subtitle1" mt={2} fontWeight="bold">
                Highlights:
              </Typography>
              <Typography variant="body1" mt={1}>
                {packageDetails?.overview?.highlights?.join(", ") ||
                  "No highlights provided."}
              </Typography>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Included
              </Typography>
              {packageDetails?.included?.length > 0 ? (
                <ul>
                  {packageDetails?.included.map((item) => (
                    <li key={item._id}>
                      <Typography variant="body1">{item.title}</Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">No inclusions provided.</Typography>
              )}
            </Box>
          )}

          {selectedTab === 2 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Tour Map
              </Typography>
              <Typography variant="body1" mt={2}>
                Explore the various stops and attractions along the tour route.
                This map provides an overview of all major sites included in the
                trip, helping travelers plan and anticipate the day's
                activities.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  backgroundColor: "#e0e0e0",
                  mt: 2,
                }}
              >
                <LoadScript googleMapsApiKey="https://maps.googleapis.com/maps/api/js?client=google-maps-embed&paint_origin=&libraries=geometry,search&v=weekly&loading=async&language=en_US&callback=onApiLoad">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                  >
                    {/* Add markers or other map features here */}
                  </GoogleMap>
                </LoadScript>
              </Box>
            </Box>
          )}
        </Grid>

        {/* Right Section - Booking Form */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: 72,
              background: "#fff",
              borderRadius: 2,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Booking Tour
            </Typography>

            {/* Date field */}
            <TextField
              label="Date"
              type="text"
              fullWidth
              value={
                packageDetails?.startDate
                  ? formatDate(packageDetails.createdAt)
                  : ""
              }
              InputProps={{
                readOnly: true,
              }}
              sx={{
                mb: 2,
                backgroundColor: "#f0f0f0",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#147d78",
                  },
                  "&:hover fieldset": {
                    borderColor: "#147d78",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#18a19a",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#147d78",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#18a19a",
                },
                "& .MuiInputLabel-root:hover": {
                  color: "#147d78",
                },
              }}
              InputLabelProps={{ shrink: true }}
            />

            {/* Quantity Controls */}
            <Stack spacing={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderBottom={1}
                borderColor="#f1f1f1"
                sx={{
                  padding: "5px 0",
                }}
              >
                <Typography>Adults (Over 18+)</Typography>
                <Box>
                  <IconButton
                    onClick={() => handleQuantityChange("adult", "decrement")}
                  >
                    <Remove />
                  </IconButton>
                  <Typography component="span">{adultCount}</Typography>
                  <IconButton
                    onClick={() => handleQuantityChange("adult", "increment")}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            </Stack>

            {/* Coupon code input */}
            <TextField
              label="Enter Coupon Code"
              fullWidth
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleApplyCoupon}
              disabled={loading}
              sx={{
                mb: 2,
                backgroundColor: "#18a19a",
                "&:hover": { backgroundColor: "#147d78" },
                padding: "5px 15px",
                fontWeight: "bold",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
              }}
            >
              Apply Coupon
            </Button>

            {/* Total and Final Amount */}
            <Typography variant="h6" mt={2}>
              Total: ₹{finalAmount > 0 ? finalAmount : calculateTotal()}
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#18a19a",
                "&:hover": { backgroundColor: "#147d78" },
                padding: "5px 15px",
                fontWeight: "bold",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
              }}
              onClick={handlePayment}
            >
              Book Now
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box>
        {/* <SliderForCards
          data={tours}
          heading1={"Similar Tours"}
          heading2={"Explore Our Promoted Experiences"}
        /> */}
      </Box>
      <FooterPage />

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        onClose={handleDialogClose}
        aria-labelledby="login-dialog-title"
      >
        <DialogTitle id="login-dialog-title">Login Required</DialogTitle>
        <DialogContent>
          <Typography>
            You need to be logged in to book this tour. Would you like to login now?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLoginRedirect} color="primary" variant="contained">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackageDetails;
