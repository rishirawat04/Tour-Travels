import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid } from '@mui/material';

import { Link } from 'react-router-dom';
import { getBlogs } from '../api/blogApi';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await getBlogs();
        const limitedBlogs = data.data.slice(0, 3);
        setBlogs(limitedBlogs);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    getBlog();
  }, []);

  const truncateDescription = (description) => {
    const maxLength = 70; 
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  return (
    <Box sx={{ bgcolor: '#FAF3E0', p: 4, mt: 16 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" component="div" color="textSecondary">
          Our Blog
        </Typography>
        <Typography variant="h4" component="h2" fontWeight="bold">
          Latest Blogs & Articles
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          maxWidth="md"
          sx={{ mx: 'auto', mt: 1 }}
        >
          In today's fast-paced world, managing travel itineraries can become a tedious and
          time-consuming task. Fortunately, with the advent of online payment services...
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {blogs.map((blog, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                width: '100%',
                height: "380px",
                borderRadius: 2,
                boxShadow: "none",
                position: 'relative',
                backgroundColor: 'transparent',
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={blog.image}
                alt={blog.title}
                sx={{
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  bgcolor: '#003c3c',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.875rem',
                }}
              >
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 100,
                  background: '#fff',
                  mx: 4,
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontWeight="bold"
                  >
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {truncateDescription(blog.description)}
                  </Typography>
                </CardContent>
                <Box sx={{ textAlign: 'center', py: 1.5,  }}>
                  <Link to={`/Blog-Details/${blog._id}`}>
                    <Button variant="text" color="primary">
                      Read More &gt;
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BlogPage;
