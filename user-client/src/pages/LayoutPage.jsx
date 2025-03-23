import { useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MdDashboard, MdStore } from "react-icons/md";
import { TravelExplore } from "@mui/icons-material";
import { FaShippingFast } from "react-icons/fa";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Outlet, Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../redux/slices/authSlice";
import { logoutServer } from "../api/auth";

const navLinks = [
  { text: "Dashboard", icon: <MdDashboard />, path: "/user/dashboard" },
  { text: "Tour History", icon: <TravelExplore />, path: "/user/tour-history" },
  { text: "Favourite List", icon: <MdStore />, path: "/user/favourite-list" },
  { text: "Payment Log", icon: <FaShippingFast />, path: "/user/payment-log" },
  {
    text: "Support Ticket",
    icon: <ReceiptIcon />,
    path: "/user/support-ticket",
  },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Dashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const location = useLocation();
  const dispatch = useDispatch();
  const { name, userId } = useSelector((state) => state.auth);

  const drawerWidth = 240;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Get the current path and replace '/admin/' with 'admin / '
    let path = window.location.pathname.replace("/user/", "user / ");

    // Remove hyphens and replace them with spaces
    path = path.replace(/-/g, " ");

    // Convert the path to uppercase
    const uppercaseRoute =
      path.charAt(0).toUpperCase() + path.slice(1).toUpperCase();

    // If no specific route, default to 'DASHBOARD'
    setCurrentRoute(uppercaseRoute || "DASHBOARD");
  }, [location.pathname]);

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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
          height: "10vh",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <Typography variant="h6" noWrap sx={{ color: "#000" }}>
                <span
                  style={{
                    color: "#147d78",
                    display: "flex",
                    alignContent: "center",
                    fontSize: "2rem",
                  }}
                >
                  A
                  <p
                    style={{
                      color: "#000",
                      fontSize: "1.2rem",
                      marginTop: "15px",
                    }}
                  >
                    noTech Travels
                  </p>
                </span>
              </Typography>
            </Link>
            <IconButton
              color="#fff"
              aria-label="open drawer"
              edge="start"
              onClick={toggleSidebar}
              sx={{ marginLeft: { xs: 0, sm: 7.5 } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              padding: "0 10px",
              marginRight: "16px",
              width: { xs: "300px", sm: "400", md: "600px" },
            }}
          >
            <SearchIcon sx={{ color: "#888", marginRight: 1 }} />
            <InputBase
              placeholder="Search..."
              sx={{ width: "100%", color: "#000" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
            <Box>
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ bgcolor: "#ff7a00" }}>{name?.charAt(0)}</Avatar>
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
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          flexShrink: 0,
          width: sidebarOpen ? drawerWidth : 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarOpen ? drawerWidth : 0,
            transition: "width 0.3s",
            overflowX: "hidden",
            boxSizing: "border-box",
          },
        }}
      >
        <List sx={{ mt: 8 }}>
          {navLinks.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              sx={{
                width: "215px",
                borderRadius: "10px",
                ml: 2,
                my: 0.4,
                cursor: "pointer",
                alignItems: "center",
                flex: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#ffebd6",
                  borderLeft: 3,
                  color: "#ff9a35",
                  borderColor: "#ff9a35",
                },
                "&:hover .links": {
                  color: "#ff9a35",
                },
                backgroundColor:
                  location.pathname === item.path ? "#ffebd6" : "inherit",
                borderLeft: location.pathname === item.path ? 3 : "none",
                borderColor:
                  location.pathname === item.path ? "#ff9a35" : "none",
              }}
            >
              <ListItemIcon
                className="links"
                sx={{
                  minWidth: 36,

                  fontSize: "1.2rem",

                  color: location.pathname === item.path ? "#ff9a35" : "#888",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {sidebarOpen && (
                <ListItemText
                  primary={item.text}
                  className="links"
                  sx={{
                    color: location.pathname === item.path ? "#ff9a35" : "#444",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        className="scrollbar-hide"
        sx={{
          backgroundColor: "#f6f8fb",
          width: sidebarOpen ? `calc(100vw - ${drawerWidth}px)` : "100vw",
          maxWidth: "100vw",
          height: { xs: "calc(100vh - 10vh)", sm: "calc(100vh)" },
          maxHeight: { xs: "calc(100vh - 10vh)", sm: "calc(100vh)" },
          overflowY: "auto",
          px: { xs: 1, sm: 2, md: 4 },
          "&::-webkit-scrollbar": {
            width: "0px",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            mt: { xs: 8, sm: 9, md: 10 },
            fontSize: {
              xs: ".6rem",
              sm: "1rem",
              md: "1rem",
              lg: "1.6rem",
            },
          }}
        >
          {currentRoute}
        </Typography>

        <Outlet />

        <Box sx={{ mb: 2 }} />
      </Box>
    </Box>
  );
};

export default Layout;
