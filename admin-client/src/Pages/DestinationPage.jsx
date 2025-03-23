import {
  Box,
  Button,
  
  Grid,
  IconButton,
  Modal,
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
import StatisticCard from "../Components/StatisticCard";
import {   Search } from "@mui/icons-material";
import first1 from "../assets/first1.jpg";
import CustomPagination from "../Components/CustomPagination";
import { getDestinationPackages } from "../api/dashboardAPI";

const DestinationPage = () => {
  
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [destinationCard, setDestinationCard] = useState([]);



  useEffect(() => {
    const getDestinationData = async () => {
      try {
        const response = await getDestinationPackages();
      
        const destinationData = response?.data.data.destinationDetails?.map(
          (destination) => ({
            destination: destination.destination,
            packages: destination.packagesCount,
            status:
              destination?.packages.length > 0
                ? destination.packages[0].status
                : "N/A",
            createdAt:
              destination?.packages.length > 0
                ? destination.packages[0].createdAt
                : "N/A",
            images:
              destination?.packages.length > 0
                ? destination.packages[0].images
                : [],
          })
        );
        setDestinationCard(response?.data.data);
        setDestinations(destinationData);
        setFilteredData(destinationData);
      } catch (error) {
        console.log(error.message);
      }
    };
    getDestinationData();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = destinations?.filter((item) =>
      item.destination.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };




  const data = [
    {
      title: "Active Destination",
      value: destinationCard.totalActiveDestinations || 0,
      total: destinationCard.totalPackages,
      percentage: 100,
      isPositive: true,
    },
    {
      title: "Inactive Destination",
      value: destinationCard.totalInactiveDestinations || 0,
      total: destinationCard.totalPackages,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Created by Today",
      value: destinationCard.createdToday || 0,
      total: destinationCard.totalPackages,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Created This Month",
      value: destinationCard.createdThisMonth || 0,
      total: destinationCard.totalPackages,
      percentage: 0,
      isPositive: false,
    },
  ];

  return (
    <Box>
      {/* Statistic Cards */}
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

      {/* Search and Actions */}
      <Box component={Paper} sx={{ bgcolor: "#fff", mt: 4 }}>
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

                <TableCell>Destination</TableCell>
                <TableCell>Packages</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
        
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => (
                  <TableRow key={index}>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={row?.images[0] || first1}
                          alt={row?.destination}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            marginRight: "8px",
                          }}
                        />
                        {row?.destination}
                      </Box>
                    </TableCell>
                    <TableCell>{row?.packages}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          display: "inline-block",
                          backgroundColor:
                            row.status === "active" ? "#d1fae5" : "#fee2e2",
                          color:
                            row.status === "active" ? "#065f46" : "#b91c1c",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "12px",
                        }}
                      >
                        {row?.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(row?.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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

export default DestinationPage;
