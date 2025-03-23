import React from 'react';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import TourIcon from '@mui/icons-material/TravelExplore'; // Use appropriate icons
import ExpertiseIcon from '@mui/icons-material/Public';
import ConnectionIcon from '@mui/icons-material/People';
import SafetyIcon from '@mui/icons-material/Security';
import whyus2 from "../assets/whyus2.webp"
const WhyChooseUs = () => {
  const cardData = [
    {
      icon: <TourIcon fontSize="large" />,
      title: "Best Tour Guide",
      description: "Our expert tour guides are your trusted companions throughout your journey. They provide an unmatched experience tailored around the destinations we explore.",
    },
    {
      icon: <ExpertiseIcon fontSize="large" />,
      title: "World Of Expertise",
      description: "With years of experience exploring various corners of the globe, our team consists of avid travelers and experts. We breathe travel and ensure that your journeys are nothing short of extraordinary.",
    },
    {
      icon: <ConnectionIcon fontSize="large" />,
      title: "Local Connection",
      description: "In every adventure destination, you can trust our local partners. Our network of seasoned local guides offers insights into the culture, ensuring a rich and genuine connection wherever your journey takes you.",
    },
    {
      icon: <SafetyIcon fontSize="large" />,
      title: "Safety Above All",
      description: "Your safety and security are our top priority. We have protocols in place to ensure that every moment of your journey is safe and enjoyable.",
    },
  ];

  return (
 <Box sx={{height:"100vh"}}>
       <Box sx={{ backgroundImage: `url(${whyus2})` , backgroundSize: 'cover', py: 8, height:"50%" }}>
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography variant="h6" color="#fff">Why Choose Us</Typography>
          <Typography variant="h4" fontWeight="bold" mb={2} color="#fff">
            Let Us Show You The Beauty Of The World
          </Typography>
          <Button variant="contained" color="primary">Book Now</Button>
        </Box>
        
       
      </Container>
    
    </Box>
    <Grid container spacing={4} p={4} mt={-20}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} mt={4} >
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Box color="primary.main" mb={2}>
                  {card.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {card.title}
                </Typography>
                <Typography color="textSecondary">
                  {card.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
 </Box>
  );
};

export default WhyChooseUs;
