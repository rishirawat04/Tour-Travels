import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "./SnackbarProvider";
import { createTourMap, getAllPackages } from "../api/packagesAPI";
import LoaderPage from "./LoaderPage";

const AddTourMapForm = () => {
  const { showSnackbar } = useSnackbar();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLandmarks, setHasLandmarks] = useState(false);
  const [hasRoutes, setHasRoutes] = useState(false);
  const [formData, setFormData] = useState({
    packageId: "",
    mapUrl: "",
    startPoint: "",
    endPoint: "",
    guideDetails: { name: "", phone: "" },
    landmarks: [{ name: "" }],
    routes: [{ routeName: "", points: [] }],
  });

  const [newLandmark, setNewLandmark] = useState("");
  const [newRouteName, setNewRouteName] = useState("");
  const [newRoutePoints, setNewRoutePoints] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        setPackages(response.data.data);
      } catch (error) {
        showSnackbar("Failed to load packages.", "error");
      }
    };

    fetchPackages();
  }, [showSnackbar]);

  const handleAddLandmark = () => {
    if (newLandmark.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      landmarks: [...prev.landmarks, { name: newLandmark }],
    }));

    setNewLandmark("");
    setHasLandmarks(true);
  };

  const handleDeleteLandmark = (index) => {
    setFormData((prev) => ({
      ...prev,
      landmarks: prev.landmarks.filter((_, i) => i !== index),
    }));
  };

  const handleAddRoute = () => {
    if (newRouteName.trim() === "" || newRoutePoints.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      routes: [
        ...prev.routes,
        { routeName: newRouteName, points: newRoutePoints.split(",") },
      ],
    }));
    setNewRouteName("");
    setNewRoutePoints("");
    setHasRoutes(true);
  };

  const handleDeleteRoute = (index) => {
    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuideChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      guideDetails: { ...prev.guideDetails, [name]: value },
    }));
  };

  const handleSubmit = async () => {
    const {
      packageId,
      mapUrl,
      startPoint,
      endPoint,
      guideDetails,
      landmarks,
      routes,
    } = formData;

    const validLandmarks = landmarks.filter((l) => l.name.trim() !== "");
    const validRoutes = routes.filter(
      (r) => r.routeName.trim() !== "" && r.points.length > 0
    );

    const updatedFormData = {
      ...formData,
      landmarks: validLandmarks,
      routes: validRoutes,
    };

    if (
      !packageId ||
      !mapUrl ||
      !startPoint ||
      !endPoint ||
      !guideDetails.name ||
      !guideDetails.phone ||
      validLandmarks.length === 0 ||
      validRoutes.length === 0
    ) {
      showSnackbar(
        "All fields are required, including landmarks and routes.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await createTourMap(updatedFormData);
      setLoading(false);
      showSnackbar(
        response.data.message || "Tour map created successfully.",
        "success"
      );
      // Reset form
      setFormData({
        packageId: "",
        mapUrl: "",
        startPoint: "",
        endPoint: "",
        guideDetails: { name: "", phone: "" },
        landmarks: [{ name: "" }],
        routes: [{ routeName: "", points: [] }],
      });
    } catch (error) {
      showSnackbar(
        error.response.data.message || "Failed to create tour map. Try again.",
        "error"
      );
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
          Add Tour Map
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
          <FormControl fullWidth>
            <InputLabel>Package</InputLabel>
            <Select
              name="packageId"
              value={formData.packageId}
              onChange={handleChange}
            >
              <MenuItem value="" disabled>
                Select a package
              </MenuItem>
              {packages.map((pkg) => (
                <MenuItem key={pkg._id} value={pkg._id}>
                  {pkg.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Map URL"
            name="mapUrl"
            value={formData.mapUrl}
            onChange={handleChange}
          />
          <TextField
            label="Start Point"
            name="startPoint"
            value={formData.startPoint}
            onChange={handleChange}
          />
          <TextField
            label="End Point"
            name="endPoint"
            value={formData.endPoint}
            onChange={handleChange}
          />
          <TextField
            label="Guide Name"
            name="name"
            value={formData.guideDetails.name}
            onChange={handleGuideChange}
          />
          <TextField
            label="Guide Phone"
            name="phone"
            value={formData.guideDetails.phone}
            onChange={handleGuideChange}
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Add Landmark"
              value={newLandmark}
              onChange={(e) => setNewLandmark(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddLandmark}>
              <Add />
            </Button>
          </Box>
          <List>
            {formData.landmarks.map((landmark, index) => (
              <ListItem key={index}>
                <ListItemText primary={landmark.name} />
                {hasLandmarks && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleDeleteLandmark(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Route Name"
              value={newRouteName}
              onChange={(e) => setNewRouteName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Points (comma-separated)"
              value={newRoutePoints}
              onChange={(e) => setNewRoutePoints(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddRoute}>
              <Add />
            </Button>
          </Box>
          <List>
            {formData.routes.map((route, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={route.routeName}
                  secondary={`Points: ${route.points.join(", ")}`}
                />
                {hasRoutes && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleDeleteRoute(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
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

export default AddTourMapForm;
