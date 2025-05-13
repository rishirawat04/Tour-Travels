import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import AppleIcon from "@mui/icons-material/Apple";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import signin from "../assets/signin.webp";
import { useSnackbar } from "../Components/SnackbarProvider";

import { useDispatch } from "react-redux";
import { userLogin } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/userAPI";

const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = "Username is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validate();
      const { userId, token, name, email, message, role, img } = await login(
        formData.username,
        formData.password
      );
    
      
if(role === 'user'){
  showSnackbar("User is not allowed ", "error")
  return
}
      // Dispatch user login action if successful
      dispatch(userLogin({ userId, token, name, email, role,img  }));

      // Show success message
      showSnackbar(message || "Logged in successfully!", "success");

      // Navigate to the last visited URL or default to dashboard
      const lastVisitedUrl = sessionStorage.getItem("lastVisitedUrl") || "/admin/dashboard";
      sessionStorage.removeItem("lastVisitedUrl"); // Clear after use
      
      // If came from a specific page, go there, otherwise go to the saved or default route
      const from = location.state?.from?.pathname || lastVisitedUrl;
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Invalid credentials. Please try again.";
      showSnackbar(errorMessage, "error");
    }
  };

  // Display error if redirected due to unauthorized access
  const displayErrorMessage = () => {
    if (location.state?.error) {
      return (
        <Typography color="error" sx={{ mb: 2 }}>
          {location.state.error}
        </Typography>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
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
        {/* Left Section: Form */}
        <Grid item xs={12} md={6} sx={{ padding: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              color: "#333",
            }}
          >
            Welcome back, Sign In
          </Typography>
          <Typography sx={{ color: "#666", marginBottom: 4 }}>
            Sign in to your account to make booking faster and easier.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              {displayErrorMessage()}
              <TextField
                label="Username"
                name="username"
                fullWidth
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember me"
                sx={{ color: "#666" }}
              />
              <Link
                href="forgot-password"
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
              <span>Sign In</span>
            </Button>
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
            Don't have an account?{" "}
            <Link
              href="/signup"
              sx={{
                color: "#FF7A00",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Grid>

        {/* Right Section: Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
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

export default SignInPage;
