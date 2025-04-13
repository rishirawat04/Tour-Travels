import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import EmailIcon from "@mui/icons-material/Email";
import { userLogout } from "../redux/slices/authSlice";
import { logoutServer } from "../api/auth";

const HeaderPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navItems = [
    { text: "Home", link: "/" },
    { text: "About Us", link: "/aboutUs" },
    { text: "Destinations", link: "/destination" },
    { text: "Packages", link: "/destinations" },
    { text: "Contact", link: "/contact" },
  ];
  const dispatch = useDispatch();
  const { isAuthenticated, name, userId } = useSelector((state) => state.auth);

  const toggleDrawer = (open) => (event) => {
    setIsDrawerOpen(open);
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 60);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(userLogout());
    logoutServer();
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          display: { sm: "flex", xs: "none" },
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: "#003c3c",
          padding: { xs: "10px", sm: "10px 30px" },
          color: "white",
        }}
      >
        {/* Contact Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.9rem" }}>+12152688872</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon />
            <Typography sx={{ fontSize: "0.9rem" }}>
              support@travel.com
            </Typography>
          </Box>
        </Box>

        {/* Social Media Section */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 1 } }}
        >
          <IconButton color="inherit" aria-label="Facebook">
            <FacebookIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="Twitter">
            <TwitterIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="Instagram">
            <InstagramIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="LinkedIn">
            <LinkedInIcon />
          </IconButton>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#18a19a",
              "&:hover": { backgroundColor: "#147d78" },
              padding: "5px 15px",
              fontWeight: "bold",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
            }}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 1 },
          backgroundColor: isScrolled ? "#003c3c" : "rgba(13, 62, 70, 0.8)",
          backdropFilter: "blur(10px)",
          transition: "background-color 0.3s ease, top 0.3s ease",
          boxShadow: isScrolled ? 4 : 0,
          position: isScrolled ? "fixed" : "relative",
          zIndex: "3000",
          width: "100%",
          top: isScrolled ? 0 : "auto",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: "#15a6ec",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "2rem",
                }}
              >
                R
                <p
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    marginTop: ".6rem",
                  }}
                >
                  ishiTech
                </p>
              </span>
              <span style={{ color: "#15a6ec", marginTop: ".5rem" }}>
                04
              </span>
            </Typography>
          </Link>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Page Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.text}
                to={item.link}
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  color: "white",
                  "&:hover": {
                    color: "#888",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    color: "white",
                    "&:hover": {
                      color: "#15a6ec",
                    },
                  }}
                >
                  {item.text}
                </Typography>
              </Link>
            ))}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              {isAuthenticated ? (
                <Box>
                  <IconButton onClick={handleAvatarClick}>
                    <Avatar sx={{ bgcolor: "#ff7a00" }}>
                      {name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    sx={{ mt: 1 }}
                  >
                    <MenuItem>
                      <Link
                        to={`/user/profile/${userId}`}
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        {name}
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                  </Menu>
                </Box>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component="a"
                    href="/signin"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#ff7a00",
                      color: "#fff",
                      padding: "6px 10px",
                      fontSize: ".8rem",
                      borderRadius: "8px",
                      transition: "background-color 0.3s, transform 0.3s",
                      "&:hover": {
                        backgroundColor: "#003c3c",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component="a"
                    href="/signup"
                    variant="contained"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#ff7a00",
                      color: "#fff",
                      padding: "6px 10px",
                      fontSize: ".8rem",
                      borderRadius: "8px",
                      transition: "background-color 0.3s, transform 0.3s",
                      "&:hover": {
                        backgroundColor: "#003c3c",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <IconButton
            edge="start"
            aria-label="menu"
            sx={{ display: { sm: "none" }, color: "#fff" }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Box>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            height: "100vh",
            backgroundColor: "#0d3e46",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Section */}
          <Box mt={8}>
            {/* Navigation Items */}
            <List>
              {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton>
                    <ListItemText
                      sx={{ color: "#fff", borderBottom: 2, marginRight: 2 }}
                      primary={item.text}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {/* User Profile and Logout */}
            {isAuthenticated && (
              <Box
                sx={{
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: { xs: 2, sm: 32 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Link
                    to={`/user/profile/${userId}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{ bgcolor: "#ff7a00", width: 56, height: 56, mr: 2 }}
                    >
                      {name?.charAt(0)}
                    </Avatar>
                    {/* User Name */}
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        marginTop: "1rem",
                      }}
                    >
                      {name}
                    </Typography>
                  </Link>
                </Box>
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: "#ff7a00",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#003c3c",
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}

            {/* Sign In and Sign Up Links */}
            {!isAuthenticated && (
              <Box
                sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <h3 style={{ color: "#888" }}>User Links</h3>
                <Link
                  to={"/signin"}
                  style={{
                    color: "#fff",
                    borderBottom: "2px solid #fff",
                    fontSize: "1rem",
                    textDecoration: "none",
                    transition: "color 0.3s, border-bottom 0.3s",
                    "&:hover": {
                      color: "#006a4e",
                      borderBottom: "2px solid #006a4e",
                    },
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to={"/signup"}
                  style={{
                    color: "#fff",
                    borderBottom: "2px solid #fff",
                    fontSize: "1rem",
                    textDecoration: "none",
                    transition: "color 0.3s, border-bottom 0.3s",
                    "&:hover": {
                      color: "#006a4e",
                      borderBottom: "2px solid #006a4e",
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Box>
            )}
          </Box>

          {/* Bottom Section */}
          <Box sx={{ padding: 2 }}>
            {/* Contact Section */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", marginBottom: 1 }}
              >
                Contact Us
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginBottom: 1,
                }}
              >
                <Typography sx={{ color: "#fff", fontSize: "0.9rem" }}>
                  +12152688872
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ color: "#fff" }} />
                <Typography sx={{ color: "#fff", fontSize: "0.9rem" }}>
                  support@travel.com
                </Typography>
              </Box>
            </Box>

            {/* Social Media Section */}
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default HeaderPage;
