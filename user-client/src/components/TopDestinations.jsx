import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
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

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getTopDestinations(); 
    
        
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

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
              src={destination?.image[0]} 
              alt={destination.destination}
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
            <Link to={`/destination/${destination.destination}`}>
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
                {destination.destination}
              </Typography>
            </Link>
            <Typography
              className="details"
              variant="h6"
              sx={{
                position: "absolute",
                bottom: "48px",
               left:50,
               right:50,
                transform: "translateX(0%) translateY(0px)",
                color: "#fff",
                fontWeight: 400,
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                opacity: 0,
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {destination.duration} 
            </Typography>
            {/* <Typography
              className="details"
              variant="h6"
              sx={{
                position: "absolute",
                bottom: "48px",
                left: "55%",
                transform: "translateX(0%) translateY(80px)",
                fontWeight: 400,
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                color: "#fff",
                opacity: 0,
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              {destination.destination} Place
            </Typography> */}
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TopDestinations;
