import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

import { createCategory } from "../api/packagesAPI";
import { useSnackbar } from "../Components/SnackbarProvider"; 

const AddPackageCategoryForm = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!categoryName || !uploadedFile) {
      showSnackbar("Category name and image are required.", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("image", uploadedFile);
      formData.append("status", "active");

      const response = await createCategory(formData);
      showSnackbar(response.data.message || "Category created successfully" , "success");
      navigate("/admin/package-category");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create category.";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Add New Category
      </Typography>

      {/* Form */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Category Name Input */}
        <TextField
          fullWidth
          label="Category Name"
          variant="outlined"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        {/* Image Upload */}
        <Box
          {...getRootProps()}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed gray",
            borderRadius: 2,
            padding: 2,
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
            "&:hover": {
              borderColor: "darkgray",
              backgroundColor: "#f9f9f9",
            },
            height: "200px",
          }}
        >
          <input {...getInputProps()} />
          {!uploadedFile ? (
            <>
              <CloudUploadIcon sx={{ fontSize: 40, color: "gray" }} />
              <Typography>
                {isDragActive
                  ? "Drop the image here"
                  : "Click or drag to upload an image"}
              </Typography>
            </>
          ) : (
            <img
              src={URL.createObjectURL(uploadedFile)}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Create Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddPackageCategoryForm;
