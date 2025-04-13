import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button, Grid, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { getBlogs } from '../api/blogApi';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogs();
        
        // Blogs API should now return a properly structured array
        if (Array.isArray(data) && data.length > 0) {
          const limitedBlogs = data.slice(0, 3);
          setBlogs(limitedBlogs);
        } else {
          console.warn("No blog data available or unexpected format", data);
          setError("No blog posts available at the moment");
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blog posts");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateDescription = (description) => {
    if (!description) return '';
    const maxLength = 70; 
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#FAF3E0', p: 4, mt: 16, textAlign: 'center' }}>
        <Typography variant="h5" component="div" color="textSecondary">
          Our Blog
        </Typography>
        <Typography variant="h4" component="h2" fontWeight="bold">
          Latest Blogs & Articles
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error || blogs.length === 0) {
    return (
      <Box sx={{ bgcolor: '#FAF3E0', p: 4, mt: 16, textAlign: 'center' }}>
        <Typography variant="h5" component="div" color="textSecondary">
          Our Blog
        </Typography>
        <Typography variant="h4" component="h2" fontWeight="bold">
          Latest Blogs & Articles
        </Typography>
        <Typography variant="body1" color="error" sx={{ mt: 4 }}>
          {error || "No blog posts available at the moment."}
        </Typography>
      </Box>
    );
  }

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
          <Grid item xs={12} sm={6} md={4} key={blog._id || index}>
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
                image={blog.image || 'https://via.placeholder.com/300x180?text=Blog+Image'}
                alt={blog.title || 'Blog post'}
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
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'No date'}
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
                    {blog.title || 'Untitled Blog Post'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {truncateDescription(blog.description)}
                  </Typography>
                </CardContent>
                <Box sx={{ textAlign: 'center', py: 1.5,  }}>
                  {blog._id && (
                    <Link to={`/Blog-Details/${blog._id}`}>
                      <Button variant="text" color="primary">
                        Read More &gt;
                      </Button>
                    </Link>
                  )}
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
