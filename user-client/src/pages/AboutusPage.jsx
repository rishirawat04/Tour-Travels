import React from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import first2 from "../assets/first2.jpg";
import HeaderPage from "../components/HeaderPage";
import { TravelExplore } from "@mui/icons-material";
import WorkIcon from "@mui/icons-material/Work";
import first8 from "../assets/first8.jpg";
import { useLocation } from "react-router-dom";
import FooterPage from "../components/FooterPage";

const AboutusPage = () => {
  const location = useLocation();

  const pathSegments = location.pathname ? location.pathname.split("/").filter(Boolean) : [];

  const currentPath = pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1].toUpperCase().replace(/-/g, " ")
    : "HOME";
  return (
    <>
      <Box sx={{backgroundColor: '#FAF3E0'}}>
        <HeaderPage />

        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={first2}
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
                {currentPath.replace(/-/g, " ")}
              </Typography>
              <Typography sx={{ fontSize: "1.5rem", whiteSpace: "nowrap" }}>
                {pathSegments.map((segment, index) => (
                  <span key={index}>
                   HOME {">"} {segment.toUpperCase().replace(/-/g, " ")}
                    {index < pathSegments.length - 1 && " > "}
                  </span>
                ))}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: "#FAF3E0", p: 4 }}>
        {/* Main Heading */}
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="#000"
          gutterBottom
          sx={{ mb: 4 }}
        >
          About Us
        </Typography>

        <Grid container spacing={4} alignItems="flex-start">
          {/* Left Section with Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={first8}
              alt="Travel"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
            {/* Overlayed Years of Experience Card */}
            <Card
              sx={{
                position: "relative",
                top: "-40px",
                left: "20px",
                width: "150px",
                p: 2,
                backgroundColor: "#fff",
                textAlign: "center",
                boxShadow: 3,
              }}
            >
              <Typography variant="h4" fontWeight="bold" color="primary">
                15+
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                YEARS OF SUCCESSFUL WORK
              </Typography>
            </Card>
          </Grid>

          {/* Right Section with Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              AnoTech Travel Makes Your Travel More Enjoyable
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Welcome to Traveller, your ultimate destination for travel and
              adventure! We are passionate about exploring the world and helping
              you embark on unforgettable journeys.
            </Typography>

            {/* Expertise and Diverse Destinations */}
            <Box display="flex" alignItems="center" mb={2}>
              <WorkIcon sx={{ fontSize: 40, color: "#147d78", mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Expertise:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  With years of experience in the travel industry, our team of
                  experts curates exceptional travel experiences that cater to
                  all interests and budgets.
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
              <TravelExplore sx={{ fontSize: 40, color: "#147d78", mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Diverse Destinations:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  From exotic tropical paradises to historical landmarks, we
                  offer a wide range of destinations that appeal to every type
                  of traveler.
                </Typography>
              </Box>
            </Box>

            {/* More About Button */}
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#18a19a",
                "&:hover": { backgroundColor: "#147d78" },
                padding: "5px 15px",
                fontWeight: "bold",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
              }}
            >
              More About
            </Button>
          </Grid>
        </Grid>
       
      </Box>
      <FooterPage />
    </>
  );
};

export default AboutusPage;
