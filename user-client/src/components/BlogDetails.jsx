import { Avatar, Box, Card, CardContent, CardMedia, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import HeaderPage from './HeaderPage';
import SearchIcon from '@mui/icons-material/Search';
import first8 from "../assets/first7.jpg"

import { Dataset } from '@mui/icons-material';
import FooterPage from './FooterPage';
import { getBlogs, getBlogsById } from '../api/blogApi';
const BlogDetails = () => {

  const {blogId} = useParams()
  const [blogs, setBlogs] = useState();
  const [allBlogs, setAllBlogs] = useState([]);


  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await getBlogsById(blogId);
      
       
        setBlogs(data.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    getBlog();
  }, [blogId]);




  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await getBlogs();
        const limitedBlogs = data.data
        setAllBlogs(limitedBlogs);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    getBlog();
  }, []);


    


  
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
    <Box sx={{p:4}}>
    <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
     
            <Card>
            <CardMedia
              component="img"
              height="400"
              image={blogs?.image}
              alt="Main Blog"
            />
            <CardContent>
            <Box display="flex" alignItems={"center"} sx={{borderBottom:1, gap:2,py:1, mt:-2 }}>
                <Typography variant="body2" color="text.secondary" sx={{display:"flex", alignItems:"center"}}>
                 <Avatar sx={{mr:1}} /> {blogs?.adminUserId.firstname} {blogs?.adminUserId.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{display:"flex", alignItems:"center"}}>
                  <Dataset />   {new Date(blogs?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                </Typography>
              </Box>
              <Typography variant="h5" component="div" fontWeight="bold" gutterBottom mt={2}>
               {blogs?.title}
              </Typography>
            
              <Typography variant="body1" color="text.primary">
              {blogs?.description}
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
            sx={{ marginBottom: 3, backgroundColor:"#fff" }}
          />

          {/* Recent Posts */}
          {allBlogs.map((post, index) => (
            <Card key={index} sx={{ display: 'flex', marginBottom: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={post.image}
                alt={post.title}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto', padding: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                  {new Date(post?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
      </Box>
      <FooterPage />
    </>
  )
}

export default BlogDetails