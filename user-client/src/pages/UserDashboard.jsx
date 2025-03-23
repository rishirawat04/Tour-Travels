import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { RemoveRedEyeOutlined, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../components/CustomPagination";

import StatisticCard from "../components/StatisticCard";
import { useSelector } from "react-redux";
import { useSnackbar } from "../components/SnackbarProvider";
import { getFavourite, removeFavourite } from "../api/dashboardApi";
import { getOrderDetials } from "../api/paymentAPI";


const UserDashboard = () => {
  const { userId } = useSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [favourite, setFavourite] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orderDetails, setOrderDetails] = useState([])

  // Fetch Favorites
  useEffect(() => {
    const fetchFavouriteList = async () => {
      try {
        const data = await getFavourite(userId);
        const orderData = await getOrderDetials(userId)
        setOrderDetails(orderData?.data.data)
        setFavourite(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavouriteList();
  },[]);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = favourite.filter((item) =>
      item.packageId.title.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  // Handle Pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Remove Favorite
  const handleRemoveFavorite = async (packageId) => {
    try {
      const response = await removeFavourite(userId, packageId);
      setFavourite(
        favourite.filter((item) => item.packageId._id !== packageId)
      );
      setFilteredData(
        filteredData.filter((item) => item.packageId._id !== packageId)
      );
      showSnackbar(response.message || "removed favorite:", "success");
    } catch (error) {
      showSnackbar(
        error.response.data.error || "Error removing favorite:",
        "error"
      );
    }
  };

  const totalPaidAmount = orderDetails?.totalPaidAmount?.$numberDecimal;


 
  const data = [
    {
      title: "Total Booked Tour",
      value: orderDetails?.totalTours || 0,
  
    },
    {
      title: "Total Transaction",
       value: totalPaidAmount || 0,
 
    },
    {
      title: "Total Support Ticket",
      value: 0,
 
    },
    {
      title: "Total Paid Amount",
       value: totalPaidAmount || 0,
  
    },
  ];

  
  return (
    <Box>
      <Box sx={{ border: "10px", my: 2, borderColor: "#888" }} />
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatisticCard
              title={item.title}
              value={item.value}
              total={item.total}
              percentage={item.percentage}
              isPositive={item.isPositive}
            />
          </Grid>
        ))}
      </Grid>
      {/* Search and Actions Table */}
      <Box component={Paper} sx={{ bgcolor: "#fff", mt: 4 }}>
        <Typography sx={{ fontSize: "25px", p: 1 }}>Favourite List</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            p: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search Destinations"
              variant="standard"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                disableUnderline: false,
              }}
              sx={{
                "& .MuiInput-underline:before": {
                  borderBottomColor: "gray",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "gray",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "darkgray",
                },
                "& label": {
                  color: "gray",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "gray",
                },
              }}
            />
            <Search sx={{ mt: 2.2, color: "gray" }} />
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f3f5" }}>
              <TableRow>
                <TableCell>SL No.</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Added At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={row.packageId.images[0]}
                          alt={row.packageId.title}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            marginRight: "8px",
                          }}
                        />
                        {row.packageId.title}
                      </Box>
                    </TableCell>
                    <TableCell>{row.packageId.price}</TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Link to={`/packageDetail/${row.packageId._id}`}>
                        <Button
                          variant="outlined"
                          startIcon={<RemoveRedEyeOutlined />}
                          sx={{
                            color: "#888",
                            borderColor: "#eef0f7",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveFavorite(row.packageId._id)}
                        sx={{
                          ml: 1,
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <CustomPagination
          total={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default UserDashboard;
