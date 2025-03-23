import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Divider,
} from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import signin from "../assets/signin.webp";
import { useSnackbar } from "../components/SnackbarProvider";
import { signup } from "../api/auth";
import LoaderPage from "../components/LoaderPage";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSnackbar } = useSnackbar(); 

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "", 
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstname) tempErrors.firstname = "First Name is required";
    if (!formData.lastname) tempErrors.lastname = "Last Name is required";
    if (!formData.username) tempErrors.username = "Username is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email address";
    }
    if (!formData.phonenumber) {
      tempErrors.phonenumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phonenumber)) {
     
      
      tempErrors.phonenumber = "Phone number must be 10 digits";
    }
    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true); 
        const { confirmPassword, ...submitData } = formData;
        const response = await signup(submitData); 
        if (response.data.success) {
          showSnackbar(
            response.data.message || "Signup successful! Please verify your email.",
            "success"
          );
          navigate(`/verify-account/${formData.email}`);
          // Optional: Reset form fields
          setFormData({
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            phonenumber: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          showSnackbar(response.message || "Signup failed. Please try again.", "error");
        }
      } catch (error) {
        showSnackbar(error.message || "An unexpected error occurred.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      showSnackbar("Please fill all fields correctly.", "error");
    }
  };


  if (loading) {
    return <LoaderPage message="Creating your account..." />;
  }
  return (
    <Box
      sx={{
        mt: 2,
        minHeight: "100vh",
        backgroundColor: "#f3faf7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
      }}
    >
      <Grid
        container
        sx={{
          backgroundColor: "#f3faf7",
          borderRadius: 4,
        }}
      >
        <Grid item xs={12} md={6} sx={{ pr: { xs: 0, md: 10 } }}>
          <form onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h2" gutterBottom color="#FF7A00">
                Create Account
              </Typography>
              <Typography variant="body1" paragraph>
                Discover the world’s best travel agency for making your
                adventure great with us.
              </Typography>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstname"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.firstname}
                    onChange={handleChange}
                    error={!!errors.firstname}
                    helperText={errors.firstname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastname"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.lastname}
                    onChange={handleChange}
                    error={!!errors.lastname}
                    helperText={errors.lastname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    name="username"
                    variant="outlined"
                    fullWidth
                    required
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    name="phonenumber"
                    variant="outlined"
                    fullWidth
                    required
                    type="tel"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    error={!!errors.phonenumber}
                    helperText={errors.phonenumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+91</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    variant="outlined"
                    fullWidth
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    variant="outlined"
                    fullWidth
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#FF7A00",
                  color: "#fff",
                  padding: "10px 0",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "0%",
                    height: "100%",
                    backgroundColor: "#FF7A00",
                    transition: "width 0.4s ease",
                    zIndex: 1,
                  },
                  "&:hover::before": {
                    width: "100%",
                  },
                  "&:hover": {
                    color: "#fff",
                  },
                  "& span": {
                    position: "relative",
                    zIndex: 2,
                  },
                }}
              >
                <span>Create Account</span>
              </Button>
              <Link
                href="/forgot-password"
                sx={{
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forget Password?
              </Link>
            </Box>
          </form> 
          <Divider sx={{ marginY: 4 }}>OR</Divider>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              sx={{
                minWidth: 50,
                borderRadius: "50%",
                border: "1px solid #ccc",
                padding: 1,
                position: "relative",
                overflow: "hidden",
                backgroundColor: "transparent",
                transition: "background-color 0.4s ease",
                "&:hover": {
                  backgroundColor: "#ff7a00",
                },
                "& .MuiSvgIcon-root": {
                  zIndex: 1,
                  position: "relative",
                  transition: "color 0.4s ease",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: "#fff",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#ff7a00",
                  borderRadius: "50%",
                  zIndex: 0,
                  transition: "transform 0.4s ease",
                  transform: "scale(0)",
                },
                "&:hover::before": {
                  transform: "scale(1)",
                },
              }}
            >
              <GoogleIcon sx={{ color: "#DB4437", fontSize: 24 }} />
            </Button>

            <Button
              sx={{
                minWidth: 50,
                borderRadius: "50%",
                border: "1px solid #ccc",
                padding: 1,
                position: "relative",
                overflow: "hidden",
                backgroundColor: "transparent",
                transition: "background-color 0.4s ease",
                "&:hover": {
                  backgroundColor: "#ff7a00",
                },
                "& .MuiSvgIcon-root": {
                  zIndex: 1,
                  position: "relative",
                  transition: "color 0.4s ease",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: "#fff",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#ff7a00",
                  borderRadius: "50%",
                  zIndex: 0,
                  transition: "transform 0.4s ease",
                  transform: "scale(0)",
                },
                "&:hover::before": {
                  transform: "scale(1)",
                },
              }}
            >
              <FacebookIcon sx={{ color: "#4267B2", fontSize: 24 }} />
            </Button>
            <Button
              sx={{
                minWidth: 50,
                borderRadius: "50%",
                border: "1px solid #ccc",
                padding: 1,
                position: "relative",
                overflow: "hidden",
                backgroundColor: "transparent",
                transition: "background-color 0.4s ease",
                "&:hover": {
                  backgroundColor: "#ff7a00",
                },
                "& .MuiSvgIcon-root": {
                  zIndex: 1,
                  position: "relative",
                  transition: "color 0.4s ease",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: "#fff",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#ff7a00",
                  borderRadius: "50%",
                  zIndex: 0,
                  transition: "transform 0.4s ease",
                  transform: "scale(0)",
                },
                "&:hover::before": {
                  transform: "scale(1)",
                },
              }}
            >
              <AppleIcon sx={{ color: "#000", fontSize: 24 }} />
            </Button>
          </Box>

          <Typography
            sx={{
              marginTop: 4,
              textAlign: "center",
              color: "#666",
            }}
          >
            You have an account?{" "}
            <Link
              href="/signin"
              sx={{
                color: "#FF7A00",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            borderRadius: "10px",
            backgroundImage: `url(${signin})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: { xs: "none", md: "block" },
          }}
        ></Grid>
      </Grid>
    </Box>
  );
};

export default SignUpPage;
