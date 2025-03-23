import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Paper,
  Grid,
  IconButton,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import img1 from "../assets/img1.jpg";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useParams } from "react-router-dom";
import { getUserProfile, deleteUser } from "../api/userAPI";
import LoaderPage from "../Components/LoaderPage";
import { useSnackbar } from "../Components/SnackbarProvider";

const sections = [
  {
    id: "basic-info",
    label: "Basic Information",
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    id: "delete-account",
    label: "Delete Account",
    icon: <DeleteOutlineIcon />,
  },
];

const UserProfilePage = () => {
  const { showSnackbar } = useSnackbar();
  const { userId } = useParams();
  const [showStack, setShowStack] = useState(false);

  const [checked, setChecked] = useState(false);

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserProfile(userId);

        setUserProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(userId);
      showSnackbar("Account deleted successfully.", "success");
      // Optionally, redirect to another page after deletion
    } catch (error) {
      showSnackbar("Failed to delete account.", "error");
    }
  };

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleScroll = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setShowStack(false);
  };

  if (!userProfile) return <LoaderPage />;

  return (
    <Grid container spacing={2}>
      {/* Top Menu Button for Smaller Screens */}
      <Grid item xs={12} sx={{ display: { xs: "block", md: "none" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: showStack ? "10px 10px 0px 0px" : "10px",
            px: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="h8" sx={{ fontWeight: 500 }}>
            Menu
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setShowStack((prev) => !prev)}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Smooth transition for Stack using Collapse */}
        <Collapse in={showStack}>
          <Box
            sx={{
              borderRadius: "0 0 10px 10px",
              borderTop: 1,
              borderColor: "#eef0f7",
              backgroundColor: "#fff",
            }}
          >
            <Stack spacing={2} sx={{ padding: 2 }}>
              {sections.map((section) => (
                <Box
                  key={section.id}
                  onClick={() => handleScroll(section.id)}
                  sx={{
                    padding: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  {section.icon}
                  <Typography variant="body1">{section.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Collapse>
      </Grid>

      {/* Left Sticky Navigation Box for Larger Screens */}
      <Grid item xs={0} md={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Paper
          sx={{
            position: "sticky",
            top: "100px",
            padding: 2,
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: "10px",
          }}
        >
          {sections.map((section) => (
            <Link
              key={section.id}
              onClick={() => handleScroll(section.id)}
              sx={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                textDecoration: "none",
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { color: "#1976d2" },
              }}
            >
              {section.icon}
              <Typography variant="body1">{section.label}</Typography>
            </Link>
          ))}
        </Paper>
      </Grid>

      {/* Right Content Section */}
      <Grid item xs={12} md={9}>
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "160px",
              borderRadius: "10px",
              position: "relative",
              mb: 8,
            }}
          >
            {/* Background Image */}
            <img
              src={img1}
              alt="Background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            {/* Profile Picture Section */}
            <Box
              sx={{
                position: "absolute",
                top: "106px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
                src={
                  userProfile.profilePic || "https://via.placeholder.com/100"
                }
                alt="Profile Placeholder"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Box>

          {sections.map((section) => (
            <Box
              key={section.id}
              id={section.id}
              sx={{
                marginBottom: 4,
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  px: 2,
                  py: 1,
                  marginBottom: 2,
                  borderBottom: 1,
                  borderColor: "#eef0f7",
                }}
              >
                {section.label}
              </Typography>
              {section.id === "basic-info" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 1,
                  }}
                >
                  <TextField
                    label="First Name"
                    fullWidth
                    value={userProfile.firstname}
                    disabled
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    value={userProfile.lastname}
                    disabled
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    value={userProfile.phonenumber}
                    disabled
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={userProfile.email}
                    disabled
                  />
                  <TextField
                    label="Role"
                    fullWidth
                    value={userProfile.role}
                    disabled
                  />
                  <TextField
                    label="Status"
                    fullWidth
                    value={userProfile.status}
                    disabled
                  />
                </Box>
              )}
              {section.id === "delete-account" && (
                <Box sx={{ px: 2 }}>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    When you delete User account, user lose access to the
                    services, and user data will be permanently deleted. You can
                    cancel the deletion within 14 days.
                  </Typography>

                  {/* Checkbox */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleCheckboxChange}
                        color="primary"
                      />
                    }
                    label="Confirm that I want to delete my account."
                  />

                  {/* Delete Button */}
                  <Button
                    variant="contained"
                    color="error"
                    disabled={!checked}
                    sx={{ mt: 2, textTransform: "none", width: "150px", mb: 2 }}
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserProfilePage;
