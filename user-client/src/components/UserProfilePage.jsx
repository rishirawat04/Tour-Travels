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
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import img1 from "../assets/img1.jpg";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  changeUserPassword,
  getUserProfile,
  
  updateUserProfile,
} from "../api/auth";
import { useParams } from "react-router-dom";
import { useSnackbar } from "./SnackbarProvider";

const sections = [
  {
    id: "basic-info",
    label: "Basic Information",
    icon: <AccountBoxOutlinedIcon />,
  },
  { id: "password", label: "Password", icon: <VpnKeyOutlinedIcon /> },
];

const UserProfilePage = () => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showStack, setShowStack] = useState(false);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserProfile(userId);
  
        if (response.success) {
          const userData = response.data;
  
          // Set profile picture preview
          setProfilePicPreview(userData.profilePic || null);
  
          // Map user data to form data
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
          console.error("Failed to fetch user details:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
  
    fetchUserDetails();
  }, [userId]);
  

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
  
    // Check if the name includes "address."
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
 
  

  const handleAddressChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const formDataToSend = new FormData();
  
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("lastname", formData.lastname);
      formDataToSend.append("phonenumber", formData.phonenumber);
  
      // Append address fields
      formDataToSend.append("address", JSON.stringify(formData.address));
  
      // Append profilePic if it exists
      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }
  
      const response = await updateUserProfile(userId, formDataToSend);
  
      if (response.success) {
       
        
        showSnackbar( response.message||"Profile updated successfully", "success");
       
       
      } else {
      
        showSnackbar( response.message||"Failed to update profile.", "error");
        
      }
    } catch (error) {
      showSnackbar( error.message||"Failed to update profile.", "error");
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };
  

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
  
    
    if (newPassword !== confirmPassword) {
      showSnackbar("New password and confirm password do not match.", "error");
      return;
    }
  
    const data = {
      currentPassword,
      newPassword,
    };
  
    try {
    
      const response = await changeUserPassword(userId, data);
  
      // Show server response message
      showSnackbar(response.message || "Password changed successfully", "success");
  
      // Optionally reset the fields after successful password change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
   
      showSnackbar(error.message || "Server error", "error");
    }
  };
  

  const handleScroll = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setShowStack(false);
  };



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
        <Box sx={{ height: "100%", overflowY: "auto" }}>
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
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                component="label"
              >
                <EditIcon sx={{ fontSize: "16px", color: "#000" }} />
                <input type="file" hidden onChange={handleFileChange} />
              </IconButton>
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
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="First Name"
                      fullWidth
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Last Name"
                      fullWidth
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                    />
                  </Box>
                  <TextField
                    label="Phone"
                    fullWidth
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                  />
                  <Typography variant="h6" sx={{ mt: 3 }}>
                    Address
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      fullWidth
                    />
                    <TextField
                      label="State"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      fullWidth
                    />
                    <TextField
                      label="Pincode"
                      name="pincode"
                      value={formData.address.pincode}
                      onChange={handleAddressChange}
                      fullWidth
                    />
                    <TextField
                      label="Colony"
                      name="colony"
                      value={formData.address.colony}
                      onChange={handleAddressChange}
                      fullWidth
                    />
                    <TextField
                      label="Home No"
                      name="homeNo"
                      value={formData.address.homeNo}
                      onChange={handleAddressChange}
                      fullWidth
                    />
                    <TextField
                      label="Landmark"
                      name="landmark"
                      value={formData.address.landmark}
                      onChange={handleAddressChange}
                      fullWidth
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}

              {section.id === "password" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 2,
                  }}
                >
  

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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
            </Box>
          ))}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePassword}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserProfilePage;
