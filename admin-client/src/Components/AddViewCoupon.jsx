import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createCoupon } from "../api/packagesAPI";
import LoaderPage from "./LoaderPage";
import { useSnackbar } from "./SnackbarProvider";
const AddViewCoupon = () => {
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    code: "",
    discountType: "",
    discountValue: "",
    expirationDate: "",
    usageLimit: "",
  });
  const [loading, setLoading] = useState(false);

  const generateCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;
    let generatedCode = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedCode += characters[randomIndex];
    }
    setFormData((prev) => ({ ...prev, code: generatedCode }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { code, discountType, discountValue, expirationDate } = formData;

    if (!code || !discountType || !discountValue || !expirationDate) {
      showSnackbar("Please fill all required fields.", "error");
      return;
    }
    setLoading(true);

    try {
      const response = await createCoupon(formData);
      setLoading(false);
      showSnackbar(
        response.data.message || "Coupon created successfully.",
        "success"
      );
      setFormData({
        code: "",
        discountType: "",
        discountValue: "",
        expirationDate: "",
        usageLimit: "",
      });
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Error creating coupon.",
        "error"
      );
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderPage />;
  }

  return (
    <Box
      component={Paper}
      sx={{
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: 1,
          borderColor: "#eef0f7",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Add Coupon Information
        </Typography>
        <Link to={"/admin/coupons"}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: "#00bcd4",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#008c9e",
              },
            }}
          >
            Back
          </Button>
        </Link>
      </Box>
      <Grid container spacing={2} p={2}>
        {/* Coupon Code */}
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Coupon Code"
            name="code"
            variant="outlined"
            size="small"
            value={formData.code}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#00d0b0", "&:hover": { bgcolor: "#00b098" } }}
            onClick={generateCouponCode}
          >
            Generate Code
          </Button>
        </Grid>

        {/* Discount Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Discount Type</InputLabel>
            <Select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Discount Value */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Discount Value"
            name="discountValue"
            variant="outlined"
            size="small"
            value={formData.discountValue}
            onChange={handleChange}
          />
        </Grid>

        {/* Expiration Date */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Expiration Date"
            name="expirationDate"
            type="date"
            variant="outlined"
            size="small"
            value={formData.expirationDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Usage Limit */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Usage Limit"
            name="usageLimit"
            variant="outlined"
            size="small"
            value={formData.usageLimit}
            onChange={handleChange}
          />
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#00bcd4" }}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddViewCoupon;
