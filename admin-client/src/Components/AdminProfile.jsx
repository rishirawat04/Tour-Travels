import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useParams } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import { useSnackbar } from "./SnackbarProvider";
import {
  getUserProfileById,
  updateUserProfile,
  changeUserPassword,
} from "../api/userAPI";

const AdminProfile = () => {
  const { userId } = useParams();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    address: {
      city: "",
      state: "",
      pincode: "",
      colony: "",
      homeNo: "",
      landmark: "",
    },
    profilePic: null,
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserProfileById(userId);
        if (response.success) {
          const userData = response.data;
          setProfilePicPreview(userData.profilePic || null);
          setFormData({
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            phonenumber: userData.phonenumber || "",
            address: {
              homeNo: userData.address?.homeNo || "",
              colony: userData.address?.colony || "",
              landmark: userData.address?.landmark || "",
              pincode: userData.address?.pincode || "",
              city: userData.address?.city || "",
              state: userData.address?.state || "",
            },
            profilePic: null,
          });
        } else {
          showSnackbar(
            response.message || "Failed to fetch user details.",
            "error"
          );
        }
      } catch (error) {
        showSnackbar(error.message || "Failed to fetch user details.", "error");
      }
    };

    fetchUserDetails();
  }, [userId, showSnackbar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("lastname", formData.lastname);
      formDataToSend.append("phonenumber", formData.phonenumber);
      formDataToSend.append("address", JSON.stringify(formData.address));
      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }

      const response = await updateUserProfile(userId, formDataToSend);

      if (response.success) {
        showSnackbar(
          response.message || "Profile updated successfully.",
          "success"
        );
      } else {
        showSnackbar(response.message || "Failed to update profile.", "error");
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to update profile.", "error");
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showSnackbar("New password and confirm password do not match.", "error");
      return;
    }

    try {
      const response = await changeUserPassword(userId, {
        currentPassword,
        newPassword,
      });
      if (response.success) {
        showSnackbar(
          response.message || "Password changed successfully.",
          "success"
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showSnackbar(response.message || "Failed to change password.", "error");
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to change password.", "error");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          width: "100%",
          height: "160px",
          borderRadius: "10px",
          position: "relative",
          mb: 8,
        }}
      >
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
          {profilePicPreview ? (
            <img
              src={profilePicPreview}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <Typography>No Image</Typography>
          )}
          <IconButton
            sx={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
            component="label"
          >
            <EditIcon sx={{ fontSize: "16px", color: "#000" }} />
            <input type="file" hidden onChange={handleFileChange} />
          </IconButton>
        </Box>
      </Box>

      {/* Admin Information */}
      <Paper elevation={3} sx={{ mb: 3, borderRadius: "10px", p: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ borderBottom: 1, borderColor: "#eef0f7", px: 2, py: 1 }}
        >
          Admin Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              value="admin"
              variant="outlined"
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value="rawatrishi991@gmail.com"
              variant="outlined"
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              fullWidth
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pincode"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Colony"
                  name="address.colony"
                  value={formData.address.colony}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Home Number"
                  name="address.homeNo"
                  value={formData.address.homeNo}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Landmark"
                  name="address.landmark"
                  value={formData.address.landmark}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      {/* Password Section */}
      <Paper elevation={3} sx={{ borderRadius: "10px", p: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ borderBottom: 1, borderColor: "#eef0f7", px: 2, py: 1 }}
        >
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSavePassword}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Current Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button type="submit" variant="contained" color="primary">
              Change Password
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminProfile;
