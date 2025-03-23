import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import StatisticCard from "../Components/StatisticCard";
import { Add, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomPagination from "../Components/CustomPagination";
import { deleteCoupon, getAllCoupon, updateCoupon } from "../api/packagesAPI";
import { useSnackbar } from "../Components/SnackbarProvider";
const CouponPage = () => {
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [couponData, setCouponData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [couponStats, setCouponStats] = useState({});

  // Fetch Coupon Data
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAllCoupon();
        setCouponStats(response.data.stats);
        setCouponData(response.data.packageDetails);
        setFilteredData(response.data.packageDetails);
      } catch (error) {
        console.error("Error fetching coupon data:", error.message);
      }
    };

    fetchCoupons();
  }, []);

  // Handle Search Filter
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = couponData.filter((coupon) =>
      coupon.code.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedRows(
      event.target.checked ? filteredData.map((row) => row._id) : []
    );
  };

  // Pagination Handlers
  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await Promise.all(
        selectedRows.map((id) => deleteCoupon(id))
      );
      showSnackbar(
        response.map((data) => data.data.message) ||
          "Selected coupons deleted successfully.",
        "success"
      );
      setSelectedRows([]);
    } catch (error) {
      showSnackbar(
        error.response.data.message || "Failed to delete selected coupons.",
        "error"
      );
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await Promise.all(
        selectedRows.map((id) => updateCoupon(id, { status: "inactive" }))
      );

      showSnackbar(
        response.map((data) => data.data.message) ||
          "Status updated successfully for selected coupons.",
        "success"
      );
      setSelectedRows([]);
    } catch (error) {
      showSnackbar(
        error.response.data.message ||
          "Failed to update status for selected coupons.",
        "error"
      );
    }
  };

  // Data for Statistic Cards
  const data = [
    {
      title: "Active Coupons",
      value: couponStats.totalActiveCoupons || 0,
      total: couponStats.totalActiveCoupons || 0,
      percentage: 100,
      isPositive: true,
    },
    {
      title: "Inactive Coupons",
      value: couponStats.totalInactiveCoupons || 0,
      total: couponStats.totalInactiveCoupons || 0,
      percentage: 0,
      isPositive: false,
    },
    {
      title: "Today's Created",
      value: couponStats.totalCreatedToday || 0,
      total: couponStats.totalCreatedToday || 0,
      percentage: 0,
      isPositive: true,
    },
    {
      title: "This Month's Created Coupons",
      value: couponStats.totalExpiredCoupons || 0,
      total: couponStats.totalExpiredCoupons || 0,
      percentage: 0,
      isPositive: false,
    },
  ];

  return (
    <Box>
      {/* Statistic Cards */}
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

      {/* Table Section */}
      <Box component={Paper} sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          {/* Search */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search Coupons"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search sx={{ ml: 1 }} />
          </Box>
          {/* Actions */}
          <Link to={"/admin/add-coupon"}>
            <Button variant="contained" startIcon={<Add />} color="primary">
              Add New
            </Button>
          </Link>
        </Box>

        {/* Action Buttons for Selected Rows */}
        {selectedRows.length > 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateStatus}
            >
              Update
            </Button>
          </Box>
        )}

        {/* Coupon Table */}
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f3f5" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length}
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < filteredData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Coupon Code</TableCell>
                <TableCell>Discount Type</TableCell>
                <TableCell>Discount Value</TableCell>
                <TableCell>Expiration Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(coupon._id)}
                        onChange={() => handleSelectRow(coupon._id)}
                      />
                    </TableCell>
                    <TableCell>{coupon._id}</TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.discountType}</TableCell>
                    <TableCell>
                      {coupon.discountValue}
                      {coupon.discountType === "percentage" ? "%" : " ₹"}
                    </TableCell>
                    <TableCell>
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{coupon.status}</TableCell>
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

export default CouponPage;
