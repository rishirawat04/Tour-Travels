import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CropFreeIcon from '@mui/icons-material/CropFree';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

const Whyus = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f9f8eb',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontStyle: 'italic', fontWeight: 300, mb: 1 }}
      >
        Features
      </Typography>

      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4, px:2 }}
      >
        Why Book With <span style={{fontSize:"3rem", color: '#008080'}}>AnoTech Travels</span> ?
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <ThumbUpIcon sx={{ fontSize: 50, color: '#008080' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mt: 2 }}
            >
              100% Trusted Tour Agency
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              Feel free to book your trip.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <SupportAgentIcon sx={{ fontSize: 50, color: '#008080' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mt: 2 }}
            >
              24/7 Guidance
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              Always Traveller guides you.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <CropFreeIcon sx={{ fontSize: 50, color: '#008080' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mt: 2 }}
            >
              Extensive Destination Options
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              Traveler offers a wide range of destinations.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <PriceCheckIcon sx={{ fontSize: 50, color: '#008080' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mt: 2 }}
            >
              Competitive Pricing
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', px:2 }}
            >
              Traveler consistently offers competitive prices and exclusive deals.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Whyus;
