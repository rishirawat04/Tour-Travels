import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import { useSnackbar } from "./SnackbarProvider";
import { resendCode, verifyOTP } from "../api/auth";
import { useNavigate, useParams } from "react-router-dom";

const VerifyAccountPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const { showSnackbar } = useSnackbar();

  // Function to handle OTP change
  const handleOtpChange = (e, index) => {
    let newOtp = [...otp];
    newOtp[index] = e.target.value;

    // Move focus to next input after a digit is entered
    if (e.target.value.length === 1 && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setOtp(newOtp);
    setOtpError(false);
  };

  // If no email is found, redirect to the registration page
  if (!email) {
    navigate("/register");
  }

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setOtpError(true);
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOTP({ email, code: otpCode });
      showSnackbar(response.msg, "success");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showSnackbar(error, "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to resend OTP
  const handleResendOtp = async () => {
    if (resendTimeout > 0) return;

    try {
      setLoading(true);
      const response = await resendCode({ email });
      showSnackbar(response.msg, "success");
      setResendTimeout(60); // 1-minute countdown
    } catch (error) {
      console.error("Error resending OTP:", error);
      showSnackbar(error, "error");
    } finally {
      setLoading(false);
    }
  };

  // Countdown for resend button
  useEffect(() => {
    if (resendTimeout > 0) {
      const interval = setInterval(() => {
        setResendTimeout((prevTime) => {
          if (prevTime <= 1) clearInterval(interval);
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [resendTimeout]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f3faf7",
        padding: 4,
      }}
    >
      <Typography variant="h4" color="primary" gutterBottom>
        Verify Your Account
      </Typography>

      <Typography variant="body1" color="textSecondary" paragraph>
        Enter the 6-digit verification code sent to your email address.
      </Typography>

      <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        {otp.map((value, index) => (
          <Grid item key={index}>
            <TextField
              id={`otp-${index}`}
              value={value}
              onChange={(e) => handleOtpChange(e, index)}
              error={otpError}
              inputProps={{ maxLength: 1 }}
              variant="outlined"
              size="small"
              sx={{ width: "50px" }}
            />
          </Grid>
        ))}
      </Grid>

      {otpError && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          Please enter a valid 6-digit OTP.
        </Typography>
      )}

      <Button
        onClick={handleVerifyOtp}
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Verify OTP"
        )}
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Button
          onClick={handleResendOtp}
          variant="outlined"
          color="secondary"
          disabled={resendTimeout > 0}
        >
          {resendTimeout > 0 ? `Resend OTP in ${resendTimeout}s` : "Resend OTP"}
        </Button>
      </Box>

      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginTop: 2, textAlign: "center" }}
      >
        <Link href="/signin" sx={{ color: "#FF7A00" }}>
          Back to Sign In
        </Link>
      </Typography>
    </Box>
  );
};

export default VerifyAccountPage;
