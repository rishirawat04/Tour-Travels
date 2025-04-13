import React, { Suspense, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  InputBase,
  CircularProgress,
  Collapse,
  Avatar,
  Divider,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
// Import icons from react-icons
import { MdDashboard, MdStore } from "react-icons/md";
import {
  ExpandLess,
  ExpandMore,
  Settings,
  TravelExplore,
} from "@mui/icons-material";
import { FaShippingFast, FaUsers } from "react-icons/fa";
import InputIcon from "@mui/icons-material/Input";
import { HiOutlineLogin, HiTicket } from "react-icons/hi";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CircleIcon from "@mui/icons-material/Circle";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../redux/slices/authSlice";
import { logoutServer } from "../api/userAPI";

const navLinks = [
  {
    heading: "Package Links",
    links: [
      {
        text: "Dashboard",
        icon: <MdDashboard size={24} />,
        link: "/admin/dashboard",
        iconColor: "#f39c12",
      },
      {
        text: "Destination",
        icon: <TravelExplore size={24} />,
        link: "/admin/destinations",
        iconColor: "#ad6643",
      },
      {
        text: "Manage Package",
        icon: <MdStore size={28} />,
        link: "",
        iconColor: "#3498db",
        sublinks: [
          { text: "Package Category", link: "/admin/package-category" },
          { text: "Packages", link: "/admin/packages" },
        ],
      },
      {
        text: "Tour Bookings",
        icon: <FaShippingFast size={24} />,
        link: "/admin/shipments",
        iconColor: "#9b59b6",
        sublinks: [
          { text: "All Tours", link: "/admin/all-tours" },
          { text: "Completed Tours", link: "/admin/completed-tours" },
          { text: "Cancelled Tours", link: "/admin/cancelled-tours" },
          { text: "Upcoming Tours", link: "/admin/upcoming-tours" },
        ],
      },
      {
        text: "Coupon",
        icon: <ReceiptIcon size={24} />,
        link: "/admin/coupons",
        iconColor: "#ad6643",
      },
      {
        text: "Review",
        icon: <ReviewsIcon size={24} />,
        link: "/admin/reviews",
        iconColor: "#c19426",
      },
    ],
  },

  {
    heading: "Transactions",
    links: [
      {
        text: "Transactions ",
        icon: <AccountBalanceIcon size={24} />,
        link: "/admin/transactions",
        iconColor: "#2c7ebf",
        sublinks: [
          { text: "All Transactions", link: "/admin/all-transactions" },
          { text: "Complete Payments", link: "/admin/complete-payments" },
        ],
      },
    ],
  },

  {
    heading: "Support Ticket",
    links: [
      {
        text: "All Tickets",
        icon: <HiTicket size={24} />,
        link: "/admin/transactions",
        iconColor: "#f4ddd1",
        sublinks: [
          { text: "All Tickets", link: "/admin/all-tickets" },

          { text: "Open Ticket", link: "/admin/open-ticket" },
          { text: "Close Ticket", link: "/admin/close-ticket" },
        ],
      },
    ],
  },
  {
    heading: "User Links",
    links: [
      {
        text: "User Management",
        icon: <FaUsers size={24} />,
        link: "/admin/discounts",
        iconColor: "#98c93f",
        sublinks: [{ text: "All Users", link: "/admin/all-users" }],
      },
    ],
  },
  {
    heading: "Settings Panel",
    links: [
      {
        text: "Control Panel",
        icon: <Settings size={24} />,
        link: "/admin/settings",
        iconColor: "#d53239",
      },
    ],
  },
];

// Loading fallback for lazy loading
export const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const Layout = () => {
  const dispatch = useDispatch();
  const { email, name, userId, img } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Dashboard");
  const [selectedLink, setSelectedLink] = useState(null);
  const [openSublinks, setOpenSublinks] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const drawerWidth = sidebarOpen ? 266 : 80;

  const handleMenuCloseAndNavigate = () => {
    handleMenuClose();
    navigate(`/admin/profile/${userId}`);
  };

  // Menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Get the last visited link from localStorage or default to "Dashboard"
    const storedLink =
      localStorage.getItem("selectedLink") || "/admin/dashboard";

    if (storedLink !== selectedLink) {
      // If the stored link is different from the selected link, navigate to the selected link
      navigate(storedLink);
      setSelectedLink(storedLink);
    }
  }, [navigate, selectedLink]);

  const handleListItemClick = (link) => {
    if (!link) return;

    const storedLink = localStorage.getItem("selectedLink");
    if (storedLink !== link) {
      // If the clicked link is different from the stored link, navigate to the clicked link
      localStorage.setItem("selectedLink", link);
      setSelectedLink(link);
      navigate(link);
    }
  };

  const handleToggle = (parentIndex) => {
    setOpenSublinks((prevState) =>
      prevState === parentIndex ? "" : parentIndex
    );
  };

  // Handle sidebar
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const drawer = (
    <div>
      {/* Profile section for mobile screens */}
      <Link to={"/admin/dashboard"} style={{ textDecoration: "none" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            gap: 1,
            mt: { xs: "80px", sm: sidebarOpen ? "4px" : "17.5px" },
            borderBottom: 1,
            borderColor: "#",
          }}
        >
          <span
            style={{
              color: "#147d78",
              display: "flex",
              alignContent: "center",
              fontSize: "2rem",
            }}
          >
            R
            {sidebarOpen && (
              <p
                style={{
                  color: "#fff",
                  fontSize: "1.2rem",
                  marginTop: "15px",
                }}
              >
                ishiTech
              </p>
            )}
          </span>
          {sidebarOpen && (
            <span style={{ color: "#147d78", marginTop: "14px" }}>04</span>
          )}
        </Typography>
      </Link>

      <List sx={{ overflowX: "none", ml: -0.5 }}>
        {navLinks.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {sidebarOpen && (
              <Typography
                variant="subtitle2"
                sx={{ ml: 4, mt: 2, fontWeight: "bold", color: "#888" }}
              >
                {section.heading}
              </Typography>
            )}
            {section.links.map((link, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={() =>
                    link.sublinks
                      ? handleToggle(`${sectionIndex}-${index}`)
                      : handleListItemClick(link.link)
                  }
                  sx={{
                    mt: 1,
                    mb: "4px",
                    ml: 2,
                    borderRadius: "10px",
                    width: sidebarOpen ? "240px" : "60px",
                    backgroundColor:
                      selectedLink === link.link ? "#6e71ff" : "inherit",
                    "&:hover": {
                      backgroundColor: "#7a7ce9",
                    },
                    "&:hover .links": {
                      color: "#fff",
                    },
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: sidebarOpen ? 60 : 70,
                      color: link.iconColor,
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <Typography
                      className="links"
                      sx={{
                        color: "#fff",
                        fontSize: { xs: "12px", sm: "16px" },
                        whiteSpace: "nowrap",
                        ml: -1.5,
                      }}
                    >
                      {link.text}
                    </Typography>
                  )}
                  {link.sublinks && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(`${sectionIndex}-${index}`);
                      }}
                      sx={{ color: "#fff" }}
                    >
                      {openSublinks === `${sectionIndex}-${index}` ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  )}
                </ListItem>

                {/* Sublinks with Transition */}
                {link.sublinks && (
                  <Collapse
                    in={openSublinks === `${sectionIndex}-${index}`}
                    timeout="auto"
                    unmountOnExit
                  >
                    {sidebarOpen && (
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Animated Border */}
                        <Box
                          sx={{
                            height: "100%",
                            borderLeft: "2px solid #fff",
                            borderColor: "#fff",
                            position: "absolute",
                            left: 65,
                            top: 0,
                            transition: "border-color 0.3s ease-in-out",
                          }}
                        />
                        {link.sublinks.map((sublink, subIndex) => (
                          <ListItem
                            button
                            key={subIndex}
                            onClick={() => handleListItemClick(sublink.link)}
                            sx={{
                              width: "160px",
                              borderRadius: "10px",
                              ml: 9,
                              my: "2px",
                              backgroundColor:
                                selectedLink === sublink.link
                                  ? "#6e71ff"
                                  : "inherit",
                              "&:hover": {
                                backgroundColor: "#7a7ce9",
                              },
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              position: "relative",
                              transition: "0.3s ease-in-out",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: "#fff" }}>
                              {sublink.text}
                            </Typography>
                          </ListItem>
                        ))}
                      </Box>
                    )}
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </List>
    </div>
  );

  // Routing logic
  useEffect(() => {
    // Get the current path and replace '/admin/' with 'admin / '
    let path = window.location.pathname.replace("/admin/", "admin / ");

    // Remove hyphens and replace them with spaces
    path = path.replace(/-/g, " ");

    // Convert the path to uppercase
    const uppercaseRoute =
      path.charAt(0).toUpperCase() + path.slice(1).toUpperCase();

    // If no specific route, default to 'DASHBOARD'
    setCurrentRoute(uppercaseRoute || "DASHBOARD");
  }, [window.location.pathname]);

  const handleLogout = () => {
    dispatch(userLogout());
    logoutServer();
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: "none",
          bgcolor: "#ffffff",
          width: { xs: "100%", sm: `calc(100vw - ${drawerWidth}px)` },
          maxWidth: { xs: "100%", sm: `calc(100vw - ${drawerWidth}px)` },
          borderBottom: 1,
          borderColor: "#888",

          height: { xs: "7vh", sm: "69.8px" },
        }}
      >
        <Toolbar sx={{ position: "relative", boxShadow: "none" }}>
          <IconButton
            color="gray"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            aria-label="toggle sidebar"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{
              mr: 2,
              display: {
                backgroundColor: "#132144",
                xs: "none",
                sm: "block",
                position: "absolute",
                left: -10,
                "&:hover": {
                  backgroundColor: "#132144",
                },
              },
            }}
          >
            {sidebarOpen ? (
              <HiOutlineLogin color="gray" size="30px" />
            ) : (
              <InputIcon sx={{ color: "gray" }} />
            )}
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
          {/* Search bar in the center */}
          <Box
            sx={{
              flexGrow: 1,
              position: "relative",
              bgcolor: "#f5f6f9",
              borderRadius: "4px",
              border: "1px solid #fff",
              mr: 2,
            }}
          >
            <SearchIcon
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                zIndex: 1,
                color: "gray",
              }}
            />
            <InputBase
              placeholder="Search…"
              sx={{
                color: "#000",
                paddingLeft: "30px",
                width: { sm: "250px", md: "400px" },
                borderRadius: "4px",
                padding: "2px 8px",
                bgcolor: "#f5f6f9",
              }}
            />
          </Box>

          {/* Avatar with Active Dot */}
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={img} sx={{ width: 40, height: 40 }}>
                {!name}
              </Avatar>
            </IconButton>
            <CircleIcon
              sx={{
                position: "absolute",
                top: 8,
                right: 6,
                fontSize: 12,
                color: "green",
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            />
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                width: 250,
              },
            }}
          >
            {/* Profile Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                px: 2,
              }}
            >
              <Avatar sx={{ width: 45, height: 45 }}>{!name}</Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {email}
                </Typography>
              </Box>
            </Box>
            <Divider />
            {/* Menu Items */}

            <MenuItem onClick={handleMenuCloseAndNavigate}>Profile</MenuItem>

            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s ease",
            bgcolor: "#132144",

            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 transparent",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
          display: { xs: "none", sm: "block" },
        }}
        open
      >
        <Link to={"/admin/dashboard"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              width: drawerWidth,
              height: "70px",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              gap: 1,
              pt: "10px",
              position: "fixed",
              bgcolor: "#132144",
              zIndex: "1001",
            }}
          >
            <span
              style={{
                color: "#147d78",
                display: "flex",
                alignContent: "center",
                fontSize: "2rem",
              }}
            >
              R
              {sidebarOpen && (
                <p
                  style={{
                    color: "#fff",
                    fontSize: "1.2rem",
                    marginTop: "15px",
                  }}
                >
                  ishiTech
                </p>
              )}
            </span>
            {sidebarOpen && (
              <span style={{ color: "#147d78", marginTop: "14px" }}>04</span>
            )}
          </Typography>
        </Link>
        <Divider
          sx={{
            width: drawerWidth,

            mt: 8.6,

            borderBottom: 1,
            borderColor: "#888",
            position: "fixed",
            bgcolor: "#132144",
            zIndex: "1001",
          }}
        />
        <List sx={{ overflowX: "none", mt: 9, ml: -0.5 }}>
          {navLinks.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sidebarOpen && (
                <Typography
                  variant="subtitle2"
                  sx={{ ml: 4, mt: 2, fontWeight: "bold", color: "#888" }}
                >
                  {section.heading}
                </Typography>
              )}
              {section.links.map((link, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={() =>
                      link.sublinks
                        ? handleToggle(`${sectionIndex}-${index}`)
                        : handleListItemClick(link.link)
                    }
                    sx={{
                      mt: 1,
                      mb: "4px",
                      ml: 2,
                      borderRadius: "10px",
                      width: sidebarOpen ? "240px" : "60px",
                      backgroundColor:
                        selectedLink === link.link ? "#6e71ff" : "inherit",
                      "&:hover": {
                        backgroundColor: "#7a7ce9",
                      },
                      "&:hover .links": {
                        color: "#fff",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarOpen ? 60 : 70,
                        color: link.iconColor,
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <Typography
                        className="links"
                        sx={{
                          color: "#fff",
                          fontSize: { xs: "12px", sm: "16px" },
                          whiteSpace: "nowrap",
                          ml: -1.5,
                        }}
                      >
                        {link.text}
                      </Typography>
                    )}
                    {link.sublinks && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(`${sectionIndex}-${index}`);
                        }}
                        sx={{ color: "#fff" }}
                      >
                        {openSublinks === `${sectionIndex}-${index}` ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    )}
                  </ListItem>

                  {/* Sublinks with Transition */}
                  {link.sublinks && (
                    <Collapse
                      in={openSublinks === `${sectionIndex}-${index}`}
                      timeout="auto"
                      unmountOnExit
                    >
                      {sidebarOpen && (
                        <Box
                          sx={{
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* Animated Border */}
                          <Box
                            sx={{
                              height: "100%",
                              borderLeft: "2px solid #fff",
                              borderColor: "#fff",
                              position: "absolute",
                              left: 65,
                              top: 0,
                              transition: "border-color 0.3s ease-in-out",
                            }}
                          />
                          {link.sublinks.map((sublink, subIndex) => (
                            <ListItem
                              button
                              key={subIndex}
                              onClick={() => handleListItemClick(sublink.link)}
                              sx={{
                                width: "160px",
                                borderRadius: "10px",
                                ml: 9,
                                my: "2px",
                                backgroundColor:
                                  selectedLink === sublink.link
                                    ? "#6e71ff"
                                    : "inherit",
                                "&:hover": {
                                  backgroundColor: "#7a7ce9",
                                },
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                position: "relative",
                                transition: "0.3s ease-in-out",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: "#fff" }}
                              >
                                {sublink.text}
                              </Typography>
                            </ListItem>
                          ))}
                        </Box>
                      )}
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </List>
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#132144",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        className="scrollbar-hide"
        sx={{
          backgroundColor: "#f6f8fb",
          width: { xs: "100%", sm: `calc(100vw - ${drawerWidth}px)` },
          maxWidth: { xs: "100%", sm: `calc(100vw - ${drawerWidth}px)` },
          height: { xs: "calc(100vh - 10vh)", sm: `calc(100vh - 10vh)` },
          maxHeight: { xs: "calc(100vh - 10vh)", sm: `calc(100vh- 10vh)` },
          overflowY: "auto",
          mt: { xs: 8, sm: 8 },
          p: { xs: 1, sm: 2 },
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
            fontSize: {
              xs: "1rem",
              sm: "1.25rem",
              md: "1.5rem",
              lg: "2rem",
            },
          }}
        >
          {currentRoute}
        </Typography>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default Layout;
