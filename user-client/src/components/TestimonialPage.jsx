import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import Slider from 'react-slick';
import men1 from "../assets/men1.jpg";
import men2 from "../assets/men2.jpg";
import men3 from "../assets/men3.jpg";
import men4 from "../assets/men4.jpg";
import men5 from "../assets/men5.jpg";
import men7 from "../assets/men7.jpg";
import { getTestimonial } from '../api/testmonial';

const TestimonialPage = () => {
  const [testimonial, setTestimonial] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setLoading(true);
        const response = await getTestimonial();
        
        // Check if response data exists and has the expected structure
        if (response && response.data && Array.isArray(response.data)) {
          const publishedTestimonials = response.data.filter(t => t.status === "Published");
          setTestimonial(publishedTestimonials);
        } else if (response && response.data && Array.isArray(response.data.data)) {
          // Alternative structure some APIs might return
          const publishedTestimonials = response.data.data.filter(t => t.status === "Published");
          setTestimonial(publishedTestimonials);
        } else {
          console.error("Unexpected response structure:", response);
          setTestimonial([]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonial([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, []);

  return (
    <Box sx={{ p: 8, textAlign: 'center', position: 'relative', mt: { xs: 80, sm: 40, md: -10 } }}>
      <Typography variant="h6" color="textSecondary" mb={2}>
        Testimonials
      </Typography>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        What Our Clients Say
      </Typography>

      {/* Positioned avatars around the testimonial card */}
      <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
        <Avatar src={men1} sx={{ position: 'absolute', top: '30%', left: '15%', width: 60, height: 60 }} />
        <Avatar src={men2} sx={{ position: 'absolute', top: '40%', right: '20%', width: 60, height: 60 }} />
        <Avatar src={men3} sx={{ position: 'absolute', bottom: '30%', left: '7%', width: 60, height: 60 }} />
        <Avatar src={men5} sx={{ position: 'absolute', bottom: '-3%', left: '25%', width: 60, height: 60 }} />
        <Avatar src={men4} sx={{ position: 'absolute', bottom: '20%', right: '10%', width: 60, height: 60 }} />
        <Avatar src={men7} sx={{ position: 'absolute', bottom: '-15%', right: '25%', width: 60, height: 60 }} />
      </Box>

      {/* Testimonials Slider */}
      {loading ? (
        <Typography>Loading testimonials...</Typography>
      ) : testimonial.length > 0 ? (
        <Slider {...settings} style={{ border: "none", boxShadow: "none" }}>
          {testimonial.map((item) => (
            <Box key={item._id} sx={{ p: 4, mx: 2, maxWidth: 600, margin: '0 auto', height: "150px" }}>
              <Typography variant="body1" color="textSecondary" mb={2}>
                {item.comment}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
                <Avatar src={item.userId?.profilePic} sx={{ mr: 2 }} />
                <Box textAlign="left">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.userId?.firstname || 'Anonymous'} {item.userId?.lastname || ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography>No testimonials available at the moment.</Typography>
      )}
    </Box>
  );
};

export default TestimonialPage;
