import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";

const ViewPackageDetails = () => {
  const [images, setImages] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [facilityInput, setFacilityInput] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // To control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Dynamic message
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");

  const MAX_IMAGES = 4;

  const handleImageUpload = (files) => {
    // Check if the number of files is within the limit
    if (images.length + files.length > MAX_IMAGES) {
      setSnackbarMessage(`You can upload a maximum of ${MAX_IMAGES} images.`);
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    const uploadedImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onDrop = (acceptedFiles) => {
    handleImageUpload(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleAddFacility = (e) => {
    if (e.key === "Enter" && facilityInput.trim()) {
      setFacilities([...facilities, facilityInput.trim()]);
      setFacilityInput("");
      setShowInputField(false);
    }
  };

  const handleRemoveFacility = (index) => {
    const updatedFacilities = facilities.filter((_, i) => i !== index);
    setFacilities(updatedFacilities);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <Box>
      <Box component={Paper} sx={{ p: 2 }}>
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
            Package Information
          </Typography>
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
        </Box>

        {/* Form Fields */}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* Name */}
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              placeholder="e.g. Centipede Tour - Guided Arizona Desert Tour By ATV"
            />
            <Tooltip title="Enter the package name" placement="top" arrow>
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

          {/* Package Details */}
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              label="Details"
              variant="outlined"
              placeholder="e.g. centipede-tour-guided-arizona-desert-tour-by-atv"
            />
            <Tooltip
              title="Enter the slug for SEO purposes"
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

          {/* Prices */}
          <TextField
            fullWidth
            label="Price For Adult"
            variant="outlined"
            placeholder="e.g. 500"
            InputProps={{ endAdornment: <Typography>USD</Typography> }}
          />
          <TextField
            fullWidth
            label="Price For Children"
            variant="outlined"
            placeholder="e.g. 500"
            InputProps={{ endAdornment: <Typography>USD</Typography> }}
          />
          <TextField
            fullWidth
            label="Price For Infant"
            variant="outlined"
            placeholder="e.g. 500"
            InputProps={{ endAdornment: <Typography>USD</Typography> }}
          />

          {/* Category */}
          <TextField
            fullWidth
            label="Category"
            variant="outlined"
            placeholder="e.g. Nature Tours"
          />

          {/* Destination and Start Point */}
          <TextField
            fullWidth
            label="Destination"
            variant="outlined"
            placeholder="e.g. Athens"
          />
          <TextField
            fullWidth
            label="Start Point"
            variant="outlined"
            placeholder="e.g. Les Corts, 08028 Barcelona, Spain"
          />

          {/* Messages */}
          <TextField
            fullWidth
            label="Start Message"
            variant="outlined"
            placeholder="Describe your starting message"
          />
          <TextField
            fullWidth
            label="End Messages"
            variant="outlined"
            placeholder="Describe your end message"
          />

          {/* Minimum and Maximum Travelers */}
          <TextField
            fullWidth
            label="Minimum Travelers"
            variant="outlined"
            placeholder="e.g. 5"
          />
          <TextField
            fullWidth
            label="Maximum Travelers"
            variant="outlined"
            placeholder="e.g. 15"
          />

          {/* Tour Duration */}
          <TextField
            fullWidth
            label="Tour Duration"
            variant="outlined"
            placeholder="e.g. 5 days 4 nights"
          />

          {/* Video Link */}
          <TextField
            fullWidth
            label="Video Link"
            variant="outlined"
            placeholder="Enter a video link"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#00c9a7",
              "&:hover": {
                backgroundColor: "#03a68b",
              },
            }}
            onClick={() => setShowInputField(true)}
          >
            + Included Facility
          </Button>

          {showInputField && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Enter Facility"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                onKeyDown={handleAddFacility}
                variant="outlined"
                fullWidth
                autoFocus
              />
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            {facilities.length > 0 && (
              <Typography variant="h6" color="textSecondary">
                Included Facilities:
              </Typography>
            )}
            <Box>
              {facilities.map((facility, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "5px 0",
                  }}
                >
                  <Typography variant="body1">{facility}</Typography>
                  <IconButton
                    onClick={() => handleRemoveFacility(index)}
                    sx={{
                      color: "red",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    <crossOriginIsolated />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Image Upload Placeholder */}
      <Box
        component={Paper}
        style={{
          marginTop: "16px",
          padding: "16px",
        }}
      >
        <Box
          {...getRootProps()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed gray",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <CloudUploadIcon style={{ fontSize: 40, color: "gray" }} />
          <Typography variant="body2" color="textSecondary">
            {isDragActive
              ? "Drop the images here"
              : `Click or drag to upload up to ${MAX_IMAGES} images for the Destination`}
          </Typography>
          <input
            {...getInputProps()}
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </Box>

        <Box
          style={{
            marginTop: "16px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              style={{
                position: "relative",
                margin: "8px",
              }}
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "white",
                  border: "1px solid gray",
                  padding: "4px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "red",
                    color: "white",
                  },
                }}
              >
                &times;
              </IconButton>
            </Box>
          ))}
        </Box>
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
        Add Category
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewPackageDetails ;
