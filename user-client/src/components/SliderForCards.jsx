import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  IconButton,
  
  useMediaQuery,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "./SnackbarProvider";
import { addFavourite } from "../api/dashboardApi";


const SliderForCards = ({data, heading1, heading2}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userId } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar(); 



const handleAddFavourite = async (packageId) => {
  
   
  try {
    await addFavourite(userId,packageId );
    showSnackbar("Package added to favorites!", "success");
  } catch (error) {
  
    
    showSnackbar( error.response.data.error ||"Failed to add package to favorites!", "error");
  }
};
  
  // Media Queries for responsiveness
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const isSm = useMediaQuery((theme) => theme.breakpoints.only("sm"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.only("md"));
  

  // Dynamically determine slidesToShow based on screen size
  const slidesToShow = isXs ? 1 : isSm ? 2 : isMd ? 3 : 4 

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + slidesToShow) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - slidesToShow + data.length) % data.length
    );
  };

  const visibleTours = data.slice(currentIndex, currentIndex + slidesToShow);

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <Typography
        variant="h6"
        sx={{ fontStyle: "italic", fontWeight: 300, textAlign: "center" }}
      >
        {heading1}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
      >
       {heading2}
      </Typography>

      <Box
        sx={{
          display: "flex",

          
          gap: 2,

          transition: "transform 0.5s ease",
          alignItems: "center",
          justifyContent: "center",

          position: "relative",

          px: {sm:6, md:8,},
        }}
      >
       
          <ArrowBackIosIcon    onClick={handlePrev}
          sx={{
            color: "#147d78",
            position: "absolute",
            left: 0,
            top: 190,
            bottom: 0,
            zIndex: 1001,
            "&:hover": {
              backgroundColor: "transparent", 
              color: "#147d78",
            },
            "&:focus": {
              outline: "none", 
            },
            cursor: "pointer",
          }}/>
    

        {visibleTours.map((tour, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 0 auto",
              borderRadius: "8px",
              boxShadow: 1,
              border: "1px solid #e0e0e0",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src={tour.images[0]}
              alt={tour.title}
              sx={{
                width: "100%",
                height: "200px",
                borderRadius: "8px 8px 0 0",
                objectFit: "cover",
                transition: "transform 0.3s ease,0.3s ease",

                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
            <IconButton
              onClick={() =>handleAddFavourite(tour._id) }
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                borderRadius: "50%",
                zIndex: 1,
              }}
            >
              <FavoriteBorderIcon 
            
              />
            </IconButton>
            <CardContent>
            <Link to={`/packageDetail/${tour._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" fontWeight="bold"   sx={{
    transition: "color 0.3s ease",
    "&:hover": {
      color: "primary.main", 
    },
  }}>
                {tour.title}
              </Typography>
            </Link>
              <Box display="flex" alignItems="center" my={1}>
                <Rating value={tour.ratings} readOnly />
              </Box>
              <Box display="flex" alignItems="center" my={1}>
                <PlaceIcon />
                <Typography variant="body2" ml={1}>
                  {tour.destination}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              
                sx={{borderTop:1, borderColor:"#5f5c5c", py:2}}
              >
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon />
                  <Typography variant="body2" ml={1}>
                    {tour.duration}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mr={2}>
                  <AttachMoneyIcon />
                  <Typography variant="body2" ml={1}>
                    From: {tour.price}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
       
          <ArrowForwardIosIcon    onClick={handleNext}
          sx={{
            color: "#147d78",
            position: "absolute",
            right: 0,
            top: 190,
            bottom: 0,
            zIndex: 1001,
            "&:hover": {
              backgroundColor: "transparent", 
              color: "#147d78",
            },
            "&:focus": {
              outline: "none", 
            },
            cursor: "pointer",
          }} />
       
      </Box>
    </Box>
  );
};

export default SliderForCards;
