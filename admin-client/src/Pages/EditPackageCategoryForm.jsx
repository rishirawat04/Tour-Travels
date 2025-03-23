import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";

import { getCategorybyId, updateCategorybyId } from "../api/packagesAPI";
import { useSnackbar } from "../Components/SnackbarProvider";

const EditPackageCategoryForm = () => {
  const { categoryId } = useParams();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

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

  useEffect(() => {
    // Fetch existing category data if editing
    const fetchCategoryData = async () => {
      try {
        setFetchingData(true);
        const response = await getCategorybyId(categoryId);
        const { name, image } = response.data.data;
        setCategoryName(name);
        setExistingImage(image);
      } catch (error) {
        showSnackbar(
          error.response?.data?.message || "Failed to fetch category data.",
          "error"
        );
      } finally {
        setFetchingData(false);
      }
    };
    fetchCategoryData();
  }, [categoryId, showSnackbar]);

  const handleSubmit = async () => {
    if (!categoryName || (!uploadedFile && !existingImage)) {
      showSnackbar("Category name and image are required.", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      if (uploadedFile) formData.append("image", uploadedFile);

      const response = await updateCategorybyId(categoryId, formData);
      showSnackbar(response.data.message, "success");
      navigate("/admin/package-category");
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update category.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Edit Tour Destination
        </Typography>
        <Link to={"/admin/package-category"}>
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

      {/* Form Fields */}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Category Name Field */}
        <TextField
          fullWidth
          label="Category Name"
          variant="outlined"
          placeholder="e.g. Office Tour"
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
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
            "&:hover": {
              borderColor: "darkgray",
              backgroundColor: "#f9f9f9",
            },
            width: { xs: "100%", md: "30%" },
            height: "250px",
          }}
        >
          <input {...getInputProps()} />
          {!uploadedFile && !existingImage ? (
            <>
              <CloudUploadIcon sx={{ fontSize: 40, color: "gray" }} />
              <Typography variant="body2" color="textSecondary">
                {isDragActive
                  ? "Drop the image here"
                  : "Click or drag to upload an image for the Category"}
              </Typography>
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  uploadedFile
                    ? URL.createObjectURL(uploadedFile)
                    : existingImage
                }
                alt="Uploaded Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            width: 200,
            backgroundColor: "#00c9a7",
            textTransform: "none",
            mt: 2,
            "&:hover": {
              backgroundColor: "#03a68b",
            },
          }}
        >
          {loading ? "Saving..." : "Update Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditPackageCategoryForm;
