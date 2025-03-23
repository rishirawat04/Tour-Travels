import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { FavoriteBorder, SentimentDissatisfied } from "@mui/icons-material";
import HeaderPage from "../components/HeaderPage";
import FooterPage from "../components/FooterPage";
import { addFavourite, getSearchResults } from "../api/dashboardApi";
import LoaderPage from "../components/LoaderPage";
import { useSnackbar } from "../components/SnackbarProvider";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 2;

const SearchResultPage = () => {
  const { userId } = useSelector((state) => state.auth);
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const params = new URLSearchParams(location.search);
  const locationQuery = params.get("location") || "";
  const dateQuery = params.get("date") || "";

  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
     
        const response = await getSearchResults(locationQuery, dateQuery); 
  
        
        const results = response.data;
        setFilteredData(results);
      } catch (error) {
        console.error("Error fetching search results:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [locationQuery, dateQuery]);


  
  const handlePageChange = (_, value) => {
    setPage(value);
  };

  if (loading) {
    return <LoaderPage />;
  }

  const paginatedData = filteredData.data.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

   const handleAddFavourite = async (packageId) => {
      try {
        await addFavourite(userId, packageId);
        showSnackbar("Package added to favorites!", "success");
      } catch (error) {
        showSnackbar(
          error.response.data.error || "Failed to add package to favorites!",
          "error"
        );
      }
    };

  return (
    <Box sx={{ backgroundColor: "#f9f8eb" }}>
      <HeaderPage />
      <Box sx={{ p: 4, mt: 10, px: { sm: 10, md: 14 } }}>
        <Typography variant="h4" mb={3}>
          Search Results for: "{locationQuery}" on "{dateQuery}"
        </Typography>

        {filteredData.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
              textAlign: "center",
            }}
          >
            <SentimentDissatisfied
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="textSecondary">
              No search results found.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={3}>
              {paginatedData.map((data) => (
              
                  <Card
                    sx={{
                      position: "relative",
                      display: "flex",
                      boxShadow: 3,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 150 }}
                      image={data.images[0]}
                      alt={data.title}
                    />
                      <Link
                  to={`/packageDetail/${data.id}`}
                  key={data.id}
                  style={{ textDecoration: "none" }}
                >
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {data.destination}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="#000">
                        {data.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {data.duration}
                      </Typography>
                      <Typography
                      color="#000"
                        variant="body2"
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                      >
                        From: {data.price}
                      </Typography>
                      <Typography
      variant="body2"
      fontWeight="bold"
      color="#000"
      sx={{ mt: 1 }}
    >
      Start Date: {new Date(data?.startDate).toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}
    </Typography>
                    </CardContent>
                    </Link>
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
                    
                  </Card>
              
              ))}
            </Stack>
            <Pagination
              count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
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
          </>
        )}
      </Box>
      <FooterPage />
    </Box>
  );
};

export default SearchResultPage;
