import React, { useState } from "react";
import HeaderPage from "../components/HeaderPage";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Card,
  CardContent,
  CardMedia,
  Button,
  PaginationItem,
  Pagination,
  Stack,
} from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import hero from "../assets/hero.jpg";
import { mockData } from "../fakeData";
import { Link, useLocation } from "react-router-dom";
import FooterPage from "../components/FooterPage";

const Item_per_page = 6;
const DestinationPage = () => {
  const [page, setPage] = useState(1);
  const handleChangePage = (_, value) => setPage(value);
  const [days, setDays] = useState(0);
  const [nights, setNights] = useState(0);
  const location = useLocation();

  const pathSegments = location.pathname
    ? location.pathname.split("/").filter(Boolean)
    : [];

  const currentPath =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].toUpperCase().replace(/-/g, " ")
      : "HOME";

  const handleFilter = () => {};
  const currentData = mockData.slice(
    (page - 1) * Item_per_page,
    page * Item_per_page
  ); 
  return (
    <Box sx={{ backgroundColor: "#f9f8eb", minHeight: "100vh" }}>
      <HeaderPage />
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={hero}
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

      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: { xs: 2, sm: 4, md: 8 },
          flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap" },
        }}
      >
        {/* Left Filter Section */}
        <Box
          sx={{
            flex: { xs: "100%", md: "30%" },
            minWidth: "300px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Search
            </Typography>
            <TextField
              fullWidth
              placeholder="Search here..."
              sx={{
                mt: 1,
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#147d78",
                  },
                  "&:hover fieldset": {
                    borderColor: "#147d78",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#18a19a",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
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
                    Search
                  </Button>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 2,
              boxShadow: 3,
              mt: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Filter By Price
            </Typography>
            <Slider
              defaultValue={50}
              aria-labelledby="price-slider"
              valueLabelDisplay="auto"
              min={99}
              max={999}
              sx={{ mt: 2, mb: 1, color: "#147d78" }}
            />
            <Typography>Price: 99$ - 999$</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 2,
              boxShadow: 3,
              mt: 4,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Filter By Days
            </Typography>

            <Stack direction="row" spacing={2} mt={2}>
              {/* Days Selector */}
              <TextField
                label="Days"
                type="number"
                variant="outlined"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{
                  width: "50%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#147d78",
                    },
                    "&:hover fieldset": {
                      borderColor: "#147d78",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#18a19a",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#147d78",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#18a19a",
                  },
                  "& .MuiInputLabel-root:hover": {
                    color: "#147d78",
                  },
                }}
              />

              {/* Nights Selector */}
              <TextField
                label="Nights"
                type="number"
                variant="outlined"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{
                  width: "50%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#147d78",
                    },
                    "&:hover fieldset": {
                      borderColor: "#147d78",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#18a19a",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#147d78",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#18a19a",
                  },
                  "& .MuiInputLabel-root:hover": {
                    color: "#147d78",
                  },
                }}
              />
            </Stack>

            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
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
              Apply Filter
            </Button>
          </Box>
        </Box>

        {/* Right Cards Section */}
        <Box
          sx={{
            flex: { xs: "100%", md: "70%" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {currentData.map((data, index) => (
            <Link to={"/packageDetail"} style={{ textDecoration: "none" }}>
              <Card key={index} sx={{ boxShadow: 3, position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={data.image}
                  alt={data.title}
                />
                <FavoriteBorder
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "#fff",
                    borderRadius: "50%",
                    p: 0.5,
                    cursor: "pointer",
                  }}
                />
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {data.location}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {data.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {`${data.rating} stars`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ({data.reviews} Reviews)
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {data.duration}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    From: {data.price}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Pagination
            count={Math.ceil(mockData.length / Item_per_page)}
            page={page}
            onChange={handleChangePage}
            sx={{
              gridColumn: "span 1",
              mt: 3,

              "& .MuiPagination-ul": { justifyContent: "center" },
            }}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  borderRadius: "50%",
                  fontWeight: "bold",
                  color: "#147d78",
                  "&.Mui-selected": {
                    backgroundColor: "#18a19a",
                    color: "#fff",
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <FooterPage />
    </Box>
  );
};

export default DestinationPage ;
