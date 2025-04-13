import { Avatar, Box, Card, CardContent, CardMedia, Grid, IconButton, InputAdornment, TextField, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import HeaderPage from './HeaderPage';
import SearchIcon from '@mui/icons-material/Search';
import first8 from "../assets/first7.jpg"
import { Dataset } from '@mui/icons-material';
import FooterPage from './FooterPage';
import { getBlogs, getBlogsById } from '../api/blogApi';

const BlogDetails = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        
        if (!blogId) {
          setError("Blog ID is missing");
          return;
        }
        
        const data = await getBlogsById(blogId);
        
        if (!data) {
          setError("Blog post not found");
          setBlog(null);
        } else {
          setBlog(data);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const blogs = await getBlogs();
        
        if (Array.isArray(blogs)) {
          // Filter out current blog and limit to 5 related posts
          const filtered = blogs
            .filter(b => b._id !== blogId)
            .slice(0, 5);
          setRelatedBlogs(filtered);
        } else {
          setRelatedBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching related blogs:", error);
        setRelatedBlogs([]);
      }
    };

    fetchRelatedBlogs();
  }, [blogId]);

  // Handle loading state
  if (loading) {
    return (
      <>
        <HeaderPage />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          backgroundColor: "#f9f8eb"
        }}>
          <CircularProgress />
        </Box>
        <FooterPage />
      </>
    );
  }

  // Handle error state
  if (error || !blog) {
    return (
      <>
        <HeaderPage />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          backgroundColor: "#f9f8eb",
          p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Blog post not found"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The blog post you're looking for might have been removed or is temporarily unavailable.
          </Typography>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/')}
          >
            Return to home page
          </Typography>
        </Box>
        <FooterPage />
      </>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: "#f9f8eb", minHeight: "100vh" }}>
        <HeaderPage />
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={first8}
            sx={{
              width: "100%",
              height: "350px",
              borderRadius: "8px",
              objectFit: "cover",
              filter: "brightness(0.8)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "1001",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Typography sx={{ fontSize: "2rem" }}>
                Blog Details
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardMedia
                  component="img"
                  height="400"
                  image={blog.image || 'https://via.placeholder.com/800x400?text=Blog+Image'}
                  alt={blog.title || "Blog Post"}
                />
                <CardContent>
                  <Box display="flex" alignItems="center" sx={{ borderBottom: 1, gap: 2, py: 1, mt: -2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 1 }} /> 
                      {blog.adminUserId?.firstname || 'Admin'} {blog.adminUserId?.lastname || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                      <Dataset />{' '}
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : 'No date'}
                    </Typography>
                  </Box>
                  <Typography variant="h5" component="div" fontWeight="bold" gutterBottom mt={2}>
                    {blog.title || "Untitled Blog Post"}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {blog.description || "No content available"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Search Field */}
              <TextField
                fullWidth
                placeholder="Search Recent Blogs"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ marginBottom: 3, backgroundColor: "#fff" }}
              />

              {/* Recent Posts */}
              <Typography variant="h6" gutterBottom>
                Related Posts
              </Typography>
              
              {relatedBlogs.length > 0 ? (
                relatedBlogs.map((post) => (
                  <Card key={post._id} sx={{ display: 'flex', marginBottom: 2, cursor: 'pointer' }}
                      onClick={() => navigate(`/Blog-Details/${post._id}`)}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 100 }}
                      image={post.image || 'https://via.placeholder.com/100x100?text=Blog'}
                      alt={post.title || "Blog post"}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flex: '1 0 auto', padding: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.title || "Untitled Blog Post"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) : 'No date'}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No related posts available
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <FooterPage />
    </>
  )
}

export default BlogDetails;