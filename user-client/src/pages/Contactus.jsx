import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Email, LocationCity, PhoneAndroid } from "@mui/icons-material";

import HeaderPage from "../components/HeaderPage";
import FooterPage from "../components/FooterPage";
import first5 from "../assets/first5.jpg";
import first6 from "../assets/first6.jpg";
import { useSnackbar } from "../components/SnackbarProvider";

const Contactus = () => {
  const location = useLocation();
  const { showSnackbar } = useSnackbar(); 

  const pathSegments = location.pathname
    ? location.pathname.split("/").filter(Boolean)
    : [];

  const currentPath =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].toUpperCase().replace(/-/g, " ")
      : "HOME";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  const validate = () => {
    if (!formData.name) {
      showSnackbar("Name is required", "error");
      return false;
    }
    if (!formData.email) {
      showSnackbar("Email is required", "error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showSnackbar("Please enter a valid email address", "error");
      return false;
    }
    if (!formData.phone) {
      showSnackbar("Phone number is required", "error");
      return false;
    }
    if (!/^\d+$/.test(formData.phone)) {
      showSnackbar("Phone number must be numeric", "error");
      return false;
    }
    if (!formData.subject) {
      showSnackbar("Subject is required", "error");
      return false;
    }
    if (!formData.message) {
      showSnackbar("Message is required", "error");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      showSnackbar("Form submitted successfully!", "success");
      
      // Add API call or form submission logic here
    }
  };

  return (
    <Box>
      <HeaderPage />
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={first5}
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
            <Typography sx={{ fontSize: "2rem" }}>
              {currentPath.replace(/-/g, " ")}
            </Typography>
            <Typography sx={{ fontSize: "1.5rem", whiteSpace: "nowrap" }}>
              {pathSegments.map((segment, index) => (
                <span key={index}>
                  HOME {">"} {segment.toUpperCase().replace(/-/g, " ")}
                  {index < pathSegments.length - 1 && " > "}
                </span>
              ))}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ padding: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={first6}
              alt="Contact Person"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Get In Touch
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Write your message"
                  variant="outlined"
                  multiline
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.subscribe}
                      onChange={handleChange}
                      name="subscribe"
                    />
                  }
                  label="Select to subscribe to our newsletter and updates."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#18a19a",
                    "&:hover": { backgroundColor: "#147d78" },
                    padding: "5px 15px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                    display: "flex",
                    mx: "auto",
                  }}
                  onClick={handleSubmit}
                >
                  Submit Now
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
         {/* Contact Details Section */}
         <Grid container spacing={3} sx={{ marginTop: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <LocationCity sx={{ color: "#147d78" }} /> Address
                </Typography>
                <Typography>
                  16/A, Romadan House City Tower, New York, USA
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <PhoneAndroid sx={{ color: "#147d78" }} /> Phone
                </Typography>
                <Typography>+121 625 621 6566</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Email sx={{ color: "#147d78" }} /> Email
                </Typography>
                <Typography>nextDestina@gmail.com</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <FooterPage />
    </Box>
  );
};

export default Contactus;
