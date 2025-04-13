import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram, LocationOn, Email, Phone } from '@mui/icons-material';

const FooterPage = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#0a0f0d', color: '#fff', py: 6, px:1 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#f0a500' }}>
              RishiTech04
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
              The Tour and Travels project is designed to provide users with a comprehensive platform for exploring and booking various travel packages.
            </Typography>
            <Box>
              <IconButton aria-label="facebook" sx={{ color: '#fff' }}>
                <Facebook />
              </IconButton>
              <IconButton aria-label="twitter" sx={{ color: '#fff' }}>
                <Twitter />
              </IconButton>
              <IconButton aria-label="linkedin" sx={{ color: '#fff' }}>
                <LinkedIn />
              </IconButton>
              <IconButton aria-label="instagram" sx={{ color: '#fff' }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Divider sx={{ width: '50px', borderBottom: '2px solid #10b981', mb: 2 }} />
            <Link href="/" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              Home
            </Link>
            <Link href="/aboutus" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              About Us
            </Link>
            <Link href="/destinations" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              Destinations
            </Link>
            <Link href="/contact" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              Contact
            </Link>
          </Grid>

          {/* Company Policy */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Company Policy
            </Typography>
            <Divider sx={{ width: '50px', borderBottom: '2px solid #10b981', mb: 2 }} />
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              Terms Of Use
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mb: 1 }}>
              Refund Policy
            </Link>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Divider sx={{ width: '50px', borderBottom: '2px solid #10b981', mb: 2 }} />
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn sx={{ color: '#10b981', mr: 1 }} />
              <Typography variant="body2">
                10714 163rd Pl, Orland Park, IL 60467, Noida UttarPardesh
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ color: '#10b981', mr: 1 }} />
              <Typography variant="body2">info@tour&travel.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Phone sx={{ color: '#10b981', mr: 1 }} />
              <Typography variant="body2">+1 5589 55488 55</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Divider sx={{ my: 4, borderColor: '#444' }} />
        <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', md: 'row' }}>
          <Typography variant="body2" color="textSecondary">
            Copyright ©2024 <Link href="#" color="inherit">RishiTech04</Link> All Rights Reserved
          </Typography>
          <Box display="flex" gap={2} mt={{ xs: 2, md: 0 }}>
            <Link href="#" color="inherit" underline="none">English</Link>
            
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterPage;
