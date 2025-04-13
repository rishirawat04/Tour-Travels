import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography, CircularProgress } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { getTopDestinations } from "../api/TopDestinationApi";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  swipeToSlide: true,
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const TopDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await getTopDestinations(); 
        
        // Check if the response is an array
        if (Array.isArray(response)) {
          setDestinations(response);
        } 
        // Check if response has a data property that is an array
        else if (response && Array.isArray(response.data)) {
          setDestinations(response.data);
        }
        // Handle other potential response structures
        else if (response && typeof response === 'object') {
          // Try to find an array in the response
          const dataArray = Object.values(response).find(value => Array.isArray(value));
          if (dataArray) {
            setDestinations(dataArray);
          } else {
            console.error("No array found in response:", response);
            setError("Invalid data format from server");
            setDestinations([]);
          }
        } else {
          console.error("Unexpected response format:", response);
          setError("Invalid data format from server");
          setDestinations([]);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError("Failed to load destinations");
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
        <Typography variant="h6" sx={{ fontStyle: "italic", fontWeight: 300 }}>
          Destination List
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Explore Top Destinations
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !destinations || destinations.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
        <Typography variant="h6" sx={{ fontStyle: "italic", fontWeight: 300 }}>
          Destination List
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Explore Top Destinations
        </Typography>
        <Typography variant="body1" color="error">
          {error || "No destinations available at the moment."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", py: 8, px: 2, overflow: "hidden" }}>
      <Typography variant="h6" sx={{ fontStyle: "italic", fontWeight: 300 }}>
        Destination List
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Explore Top Destinations
      </Typography>
      <Slider {...sliderSettings}>
        {destinations.map((destination, index) => (
          <Box
            key={index}
            sx={{
              px: 2,
              textAlign: "center",
              position: "relative",
              "&:hover img": {
                transform: "scale(1.02)",
                filter: "brightness(0.9)",
              },
              "&:hover .details": {
                opacity: 1,
                transform: "translateY(0)",
              },
            }}
          >
            <Box
              component="img"
              src={destination?.image && destination.image.length > 0 ? destination.image[0] : ''}
              alt={destination.destination || 'Destination image'}
              sx={{
                width: "96%",
                height: "300px",
                borderRadius: "8px",
                objectFit: "cover",
                filter: "brightness(0.8)",
                transition: "transform 0.5s ease, filter 0.3s ease",
                cursor: "pointer"
              }}
            />
            <Link to={`/destination/${destination.destination || ''}`}>
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  bottom: "120px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#fff",
                  fontWeight: 700,
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                  '&:hover':{
                    color: "#147d78",
                  }
                }}
              >
                {destination.destination || 'Destination'}
              </Typography>
            </Link>
            <Typography
              className="details"
              variant="h6"
              sx={{
                position: "absolute",
                bottom: "48px",
                left: 50,
                right: 50,
                transform: "translateX(0%) translateY(0px)",
                color: "#fff",
                fontWeight: 400,
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                opacity: 0,
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {destination.duration || ''}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TopDestinations;
