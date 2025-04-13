import React from 'react';
import { Box, Typography, Button, Card, Grid } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import TravelExplore from '@mui/icons-material/TravelExplore';
import first8 from "../assets/first8.jpg";

const AboutUs = () => {
  return (
    <Box sx={{ backgroundColor: '#FAF3E0', p: 4 }}>
      {/* Main Heading */}
      <Typography 
        variant="h3" 
        fontWeight="bold" 
        textAlign="center" 
        color="#000" 
        gutterBottom
        sx={{ mb: 4 }}
      >
        About Us
      </Typography>
      
      <Grid container spacing={4} alignItems="flex-start">
        
        {/* Left Section with Image */}
        <Grid item xs={12} md={6} >
      
          <Box
            component="img"
            src={first8}
            alt="Travel"
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
          {/* Overlayed Years of Experience Card */}
          <Card
            sx={{
              position: 'relative',
              top: '-40px',
              left: '20px',
              width: '150px',
              p: 2,
              backgroundColor: '#fff',
              textAlign: 'center',
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary">
              15+
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              YEARS OF SUCCESSFUL WORK
            </Typography>
          </Card>
        </Grid>

        {/* Right Section with Text Content */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            RishiTech04 Makes Your Travel More Enjoyable
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Welcome to Traveller, your ultimate destination for travel and adventure! We are
            passionate about exploring the world and helping you embark on unforgettable journeys.
          </Typography>
          
          {/* Expertise and Diverse Destinations */}
          <Box display="flex" alignItems="center" mb={2}>
            <WorkIcon sx={{ fontSize: 40, color: '#147d78', mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Expertise:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                With years of experience in the travel industry, our team of experts curates
                exceptional travel experiences that cater to all interests and budgets.
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <TravelExplore sx={{ fontSize: 40, color: '#147d78', mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Diverse Destinations:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                From exotic tropical paradises to historical landmarks, we offer a wide range
                of destinations that appeal to every type of traveler.
              </Typography>
            </Box>
          </Box>

          {/* More About Button */}
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#18a19a",
              "&:hover": { backgroundColor: "#147d78" },
              padding: "5px 15px",
              fontWeight: "bold",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
            }}
          >
            More About
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
