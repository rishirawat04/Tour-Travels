import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import hero from "../assets/hero.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "./SnackbarProvider";
const images = [hero, hero2, hero3, hero4];
const HeroPage = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const [query, setQuery] = useState({location:"", date: ""});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleChange = (e) => {
    setQuery({...query, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const dateParts = query.date.split('/');
    if (dateParts.length === 3) {
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to YYYY-MM-DD
  
      if (query.location.trim() || query.date.trim()) {
        const params = new URLSearchParams({
          location: query.location,
          date: formattedDate, // Use the correctly formatted date
        }).toString();
        navigate(`/search?${params}`);
      } else {
        showSnackbar("Please enter both location and date", "error");
      }
    } else {
      showSnackbar("Invalid date format. Please use DD/MM/YYYY.", "error");
    }
  };
  


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 16px",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "2.5rem",
          letterSpacing: "0.1rem",
          // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          background: "linear-gradient(90deg, #15a6ec, #15a6ec)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Discover The
      </Typography>

      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
        }}
      >
        Travels & Adventure
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 300,
          marginBottom: 4,
          fontSize: "1.8rem",
        }}
      >
        Travel Far, Travel Wide, And Travel Boldly Country
      </Typography>

      <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "30px",
        padding: "8px 16px",
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <TextField
        name="location"
        placeholder="Where to?"
        variant="standard"
        value={query.location}
        onChange={handleChange}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          flex: 1,
          marginRight: 2,
        }}
      />

      <TextField
        name="date"
        placeholder="01/01/2024"
        variant="standard"
        value={query.date}
        onChange={handleChange}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          flex: 1,
          marginRight: 2,
        }}
      />

      <IconButton
        type="submit"
        color="primary"
        sx={{ bgcolor: "primary.main", color: "#fff", borderRadius: "50%" }}
      >
        <SearchIcon />
      </IconButton>
    </Box>

    </Box>
  );
};

export default HeroPage;
