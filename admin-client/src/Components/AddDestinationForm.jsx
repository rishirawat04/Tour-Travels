import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const AddCategoryForm = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Update state with the uploaded file
    if (acceptedFiles.length > 0) {
      setUploadedFile(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

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
          Add Tour Destination
        </Typography>
        <Link to={"/admin/categories"}>
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
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            label="Destination Name"
            variant="outlined"
            placeholder="e.g. Office Tour"
            InputProps={{
              sx: {
                "&.Mui-focused fieldset": {
                  borderColor: "gray",
                },
              },
            }}
          />
          <Tooltip
            title="Enter the category name (e.g., Office Tour)"
            placement="top"
            arrow
          >
            <IconButton
              sx={{
                position: "absolute",
                right: "0px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            >
              ?
            </IconButton>
          </Tooltip>
        </Box>

        {/* Category Description Field */}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            placeholder="Write a brief description about the category."
            multiline
            rows={3}
            InputProps={{
              sx: {
                "&.Mui-focused fieldset": {
                  borderColor: "darkgray",
                },
              },
            }}
          />
          <Tooltip
            title="Optional: Add a short description for the category"
            placement="top"
            arrow
          >
            <IconButton
              sx={{
                position: "absolute",
                right: "0px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            >
              ?
            </IconButton>
          </Tooltip>
        </Box>

        {/* Image Upload Placeholder */}
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
            width: {xs:"100%", md:"30%"},
            height: "250px",
          }}
        >
          <input {...getInputProps()} />
          {!uploadedFile ? (
            <>
              <CloudUploadIcon sx={{ fontSize: 40, color: "gray" }} />
              <Typography variant="body2" color="textSecondary">
                {isDragActive
                  ? "Drop the image here"
                  : "Click or drag to upload an image for the Destination"}
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
                src={uploadedFile}
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
          startIcon={<AddIcon />}
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
          Add Destination
        </Button>
      </Box>
    </Box>
  );
};

export default AddCategoryForm;
