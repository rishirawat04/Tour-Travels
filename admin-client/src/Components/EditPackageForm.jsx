import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "./SnackbarProvider";
import {
  getCategoryPackages,
  updatePackageById,
  getPackageById,
} from "../api/packagesAPI";
import { Add, Delete } from "@mui/icons-material";
import LoaderPage from "./LoaderPage";
import { useParams } from "react-router-dom";

const EditPackageForm = () => {
  const { packageId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newOverview, setNewOverview] = useState("");
  const [newIncluded, setNewIncluded] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    destination: "",
    duration: "",
    tourType: "",
    minTravelers: "",
    maxTravelers: "",
    price: "",
    discountPrice: "",
    status: "active",
    ratings: 5,
    overview: [],
    included: [],
    startDate: "",
  });

  const MAX_IMAGES = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await getCategoryPackages();
        const packageResponse = await getPackageById(packageId);

        setCategories(categoriesResponse.data.categories);

        const packageData = packageResponse?.data.data;
        setFormData({
          categoryId: packageData.categoryId._id,
          title: packageData.title,
          destination: packageData.destination,
          duration: packageData.duration,
          tourType: packageData.tourType,
          minTravelers: packageData.minTravelers,
          maxTravelers: packageData.maxTravelers,
          price: packageData.price,
          discountPrice: packageData.discountPrice,
          status: packageData.status,
          ratings: packageData.ratings,
          overview: packageData.overview.highlights.map((text) => ({ text })),
          included: packageData.included.map((item) => ({ title: item.title })),
          startDate: new Date(packageData.startDate)
            .toISOString()
            .split("T")[0],
        });
        setImages(packageData.images);
      } catch (error) {
        showSnackbar(
          error.response.data.message || "Failed to load data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [packageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOverview = () => {
    if (newOverview.trim()) {
      setFormData((prev) => ({
        ...prev,
        overview: [...prev.overview, { text: newOverview }],
      }));
      setNewOverview("");
    }
  };

  const handleAddIncluded = () => {
    if (newIncluded.trim()) {
      setFormData((prev) => ({
        ...prev,
        included: [...prev.included, { title: newIncluded }],
      }));
      setNewIncluded("");
    }
  };

  const handleDeleteOverview = (index) => {
    setFormData((prev) => ({
      ...prev,
      overview: prev.overview.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteIncluded = (index) => {
    setFormData((prev) => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (files) => {
    if (images.length + files.length > MAX_IMAGES) {
      showSnackbar(
        `You can upload a maximum of ${MAX_IMAGES} images.`,
        "error"
      );
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const onDrop = (acceptedFiles) => {
    handleImageUpload(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleSubmit = async () => {
    if (
      !formData.categoryId ||
      !formData.title ||
      !formData.destination ||
      !formData.duration ||
      !formData.tourType ||
      !formData.minTravelers ||
      !formData.maxTravelers ||
      !formData.startDate ||
      !formData.price
    ) {
      showSnackbar("All required fields must be filled.", "error");
      return;
    }
    setLoading(true);

    const formDataToSend = new FormData();
    images.forEach((image) => {
      if (typeof image === "string") {
        formDataToSend.append("existingImages", image);
      } else {
        formDataToSend.append("image", image);
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) =>
          formDataToSend.append(`${key}[${index}]`, JSON.stringify(item))
        );
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await updatePackageById(packageId, formDataToSend);
      showSnackbar(
        response?.data?.message || "Package updated successfully",
        "success"
      );
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to update package.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderPage />;
  }

  return (
    <Box>
      <Box component={Paper} sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Edit Package
        </Typography>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mt: 3,
          }}
        >
          <TextField
            select
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
          />
          <TextField
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 5 days 4 nights"
          />
          <TextField
            label="Tour Type"
            name="tourType"
            value={formData.tourType}
            onChange={handleChange}
            placeholder="e.g. Adventure"
          />
          <TextField
            label="Minimum Travelers"
            name="minTravelers"
            value={formData.minTravelers}
            onChange={handleChange}
          />
          <TextField
            label="Maximum Travelers"
            name="maxTravelers"
            value={formData.maxTravelers}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            label="Discount Price"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
          />
          {/* Dynamic Overview Section */}
          <Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Add Overview"
                value={newOverview}
                onChange={(e) => setNewOverview(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddOverview}>
                <Add />
              </Button>
            </Box>
            <List>
              {formData.overview.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item.text} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleDeleteOverview(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
          {/* Dynamic Included Section */}
          <Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Add Included"
                value={newIncluded}
                onChange={(e) => setNewIncluded(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAddIncluded}>
                <Add />
              </Button>
            </Box>
            <List>
              {formData.included.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={item.title} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleDeleteIncluded(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box
          {...getRootProps()}
          sx={{
            mt: 3,
            p: 2,
            border: "2px dashed gray",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          <Typography>
            {isDragActive
              ? "Drop the images here"
              : "Drag and drop images, or click to upload"}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          {images.map((file, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <img
                src={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
                alt="preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <IconButton
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                ×
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            mt: 3,
            backgroundColor: "#00c9a7",
            "&:hover": { backgroundColor: "#03a68b" },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default EditPackageForm;
