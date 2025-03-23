import React, { useEffect, useState } from "react";
import HeaderPage from "./HeaderPage";
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
} from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import hero from "../assets/hero.jpg";
import { Link, useLocation, useParams } from "react-router-dom";
import { getTopDestinationPackages } from "../api/TopDestinationApi";
import { useSelector } from "react-redux";
import { addFavourite } from "../api/dashboardApi";
import { useSnackbar } from "./SnackbarProvider";

const Item_per_page = 4;

const CategoriesPage = () => {
  const { destinationName } = useParams();
  const { userId } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const [topDestinationPackages, setTopDestinationPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([999, 20000]);
  const [days, setDays] = useState(0);
  const [nights, setNights] = useState(0);

  const handleChangePage = (_, value) => setPage(value);
  const location = useLocation();

  useEffect(() => {
    const fetchTopDestinationPackages = async () => {
      try {
        const data = await getTopDestinationPackages(destinationName);

        setTopDestinationPackages(data);
        setFilteredPackages(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    if (destinationName) {
      fetchTopDestinationPackages();
    }
  }, [destinationName]);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  let breadcrumbs = ["HOME"];
  if (pathSegments.includes("destination")) {
    breadcrumbs.push("DESTINATION");
  }
  if (destinationName) {
    breadcrumbs.push(destinationName.replace(/-/g, " ").toUpperCase());
  }
  const breadcrumbString = breadcrumbs.join(" > ");

  const handleFilter = () => {
    let filtered = topDestinationPackages;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(search.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    );

    // Filter by days and nights
    if (days > 0) {
      filtered = filtered.filter((pkg) => pkg.duration.includes(days));
    }
    if (nights > 0) {
      filtered = filtered.filter((pkg) => pkg.duration.includes(nights));
    }

    setFilteredPackages(filtered);
    setPage(1);
  };

  const currentData = filteredPackages?.slice(
    (page - 1) * Item_per_page,
    page * Item_per_page
  );

  const handleAddFavourite = async (packageId) => {
    try {
      await addFavourite(userId, packageId);
      showSnackbar("Package added to favorites!", "success");
    } catch (error) {
      showSnackbar(
        error.response.data.msg || "Failed to add package to favorites!",
        "error"
      );
    }
  };

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
              {breadcrumbString}
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
        <Box sx={{ flex: { xs: "100%", md: "30%" }, minWidth: "300px" }}>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here..."
              sx={{
                mt: 1,
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#147d78" },
                  "&:hover fieldset": { borderColor: "#147d78" },
                  "&.Mui-focused fieldset": { borderColor: "#18a19a" },
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
                    onClick={handleFilter}
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
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={999}
              max={20000}
              sx={{ mt: 2, mb: 1, color: "#147d78" }}
            />
            <Typography>
              Price: {priceRange[0]} - {priceRange[1]}
            </Typography>
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
            <TextField
              label="Days"
              type="number"
              variant="outlined"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ width: "50%" }}
            />

            <Typography variant="h6" fontWeight="bold">
              Filter By Nights
            </Typography>
            <TextField
              label="Nights"
              type="number"
              variant="outlined"
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ width: "50%" }}
            />

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
          {currentData?.map((data, index) => (
            <Card sx={{ boxShadow: 3, position: "relative" }}>
              <CardMedia
                component="img"
                height="200"
                image={data?.images[0]}
                alt={data.title}
              />
              <FavoriteBorder
                onClick={() => handleAddFavourite(data._id)}
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
              <Link
                to={`/packageDetail/${data._id}`}
                style={{ textDecoration: "none" }}
                key={index}
              >
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {data.destination}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="#000">
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
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >{`${data.ratings} stars`}</Typography>
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
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ mt: 1 }}
                    color="#000"
                  >
                    From: {data.price}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          ))}
          <Pagination
            count={Math.ceil(filteredPackages?.length / Item_per_page)}
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
    </Box>
  );
};

export default CategoriesPage;
