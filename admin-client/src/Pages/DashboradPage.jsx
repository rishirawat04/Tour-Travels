import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  TableCell,
  Avatar,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Paper,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Person,
  HourglassEmpty,
  Comment,
  CreditCard,
} from "@mui/icons-material";

import EditIcon from "@mui/icons-material/Edit";
import { getAllUsers, getTickets } from "../api/dashboardAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const barData = {
  labels: [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
    "Day 8",
    "Day 9",
    "Day 10",
    "Day 11",
    "Day 12",
    "Day 13",
    "Day 14",
    "Day 15",
  ],
  datasets: [
    {
      label: "Total Booking",
      data: [
        4000, 7000, 2000, 5000, 6000, 3000, 8000, 2000, 4000, 6000, 1000, 3000,
        4000, 5000, 7000,
      ],
      backgroundColor: "#3498db",
    },
    {
      label: "Booking Amount",
      data: [
        2000, 5000, 1000, 3000, 4000, 2000, 6000, 1000, 3000, 4000, 500, 2000,
        3000, 4000, 6000,
      ],
      backgroundColor: "#888",
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
};

const fakeData = [
  {
    fullName: "Rishi Rawat",
    username: "@rishi_rawat",
    email: "rawatrishi390@gmail.com",
    phone: "8273147793",
    balance: "$0",
    country: "Bangladesh (বাংলাদেশ)",
    status: "Active",
    lastLogin: "3 days ago",
  },
  {
    fullName: "Rohit Kumar",
    username: "@rohit",
    email: "rohit@maxtratechnologies.com",
    phone: "8595547029",
    balance: "$0",
    country: "Bangladesh (বাংলাদেশ)",
    status: "Active",
    lastLogin: "1 month ago",
  },
  {
    fullName: "Jane Doe",
    username: "@doejohn",
    email: "doe.john@yahoo.com",
    phone: "6082 9768",
    balance: "$0",
    country: "SINGAPORE",
    status: "Active",
    lastLogin: "2 months ago",
  },
  {
    fullName: "Carrie Braun",
    username: "@volson",
    email: "lucy.harber@yahoo.com",
    phone: "+1 (938) 451-9892",
    balance: "$0",
    country: "Haiti",
    status: "Active",
    lastLogin: "3 months ago",
  },
  {
    fullName: "Rylee O'Reilly",
    username: "@roy28",
    email: "blesch@hotmail.com",
    phone: "+1.762.360.0068",
    balance: "$0",
    country: "China",
    status: "Active",
    lastLogin: "5 months ago",
  },
];

const DashboardPage = () => {
  const [userTicket, setTicketData] = useState(fakeData);
  const [userCardData, setUserCardData] = useState([]);
  const [userData, setUserData] = useState([]);

  const data = {
    labels: [
      "Day 01",
      "Day 03",
      "Day 05",
      "Day 07",
      "Day 09",
      "Day 11",
      "Day 13",
      "Day 15",
      "Day 17",
      "Day 19",
      "Day 21",
      "Day 23",
      "Day 25",
      "Day 27",
      "Day 29",
    ],
    datasets: [
      {
        label: "Deposit",
        data: [0, 1200, 1800, 200, 700, 1100, 200, 0, 300, 0, 1000, 0, 0, 0, 0],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#7f8c8d",
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          color: "#7f8c8d",
          beginAtZero: true,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  useEffect(() => {
    const getTicketsData = async () => {
      try {
        const tickets = await getTickets();
        const user = await getAllUsers();
        setUserCardData(user.data.stats);
        setUserData(user.data.data);
        setTicketData(tickets.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getTicketsData();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: userCardData?.totalUsers || 0,
      icon: <Person />,
      change: "0%",
      from: "32",
    },
    {
      title: "Open Tickets",
      value: userTicket?.counts?.open || 0,
      icon: <Comment />,
      change: "-100%",
      from: "73",
    },
    {
      title: "Pending KYC",
      value: userCardData?.totalNotVerifiedUsers || 0,
      icon: <HourglassEmpty />,
      change: "0%",
      from: "3",
    },
    {
      title: "This Month Transactions",
      value: 0,
      icon: <CreditCard />,
      change: "0%",
      from: "0",
    },
  ];

  return (
    <Box>
      <Grid container spacing={3} alignItems="stretch">
        {/* Recent Transaction Graph */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              height: "100%",
              borderBottom: 2,
              borderColor: "#6371f8",
              boxShadow: "none",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignContent: "center",
                justifyContent: "space-between",
                borderBottom: 1,
                borderColor: "#888",
                p: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Transaction
              </Typography>
              <Box>
                <Button sx={{ color: "#888" }}>This Month</Button>
                <Button sx={{ color: "#888" }}>Last Month</Button>
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                DEPOSIT: $6,467.09
              </Typography>

              <Line data={data} options={options} />
            </Box>
          </Card>
        </Grid>

        {/* Stats Cards: 2x2 layout */}
        <Grid item xs={12} md={5}>
          <Grid
            container
            spacing={3}
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card
                  sx={{
                    borderBottom: 2,
                    borderColor: "#6371f8",
                    boxShadow: "none",
                    borderRadius: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          width: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 40,
                          color: "primary.main",
                          bgcolor: "#e7e7ff",
                          p: 1,
                          borderRadius: 2,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#888",
                          mt: 2,
                          whiteSpace: { md: "nowrap" },
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.change.includes("-")
                            ? "error.main"
                            : "success.main",
                          mt: 2,
                        }}
                      >
                        <span
                          style={{
                            borderRadius: 2,
                            backgroundColor: stat.change.includes("-")
                              ? "#fdedf1"
                              : "#f1f3f5",
                            padding: "1px 3px",
                            marginRight: 4,
                          }}
                        >
                          {stat.change}
                        </span>
                        from {stat.from}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="stretch" mt={4}>
        {/* Bar Graph */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Package Booking
            </Typography>
            <Bar data={barData} options={barOptions} />
          </Card>
        </Grid>

        {/* Flex container for stats */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { sm: "row", md: "column" },
            }}
          >
            <Box
              sx={{
                flex: "1 1 48%",
                bgcolor: "white",
                p: 2,
                borderRadius: 2,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Property Booking
              </Typography>
              <Typography variant="h4" color="primary">
                400 Unit
              </Typography>
            </Box>

            <Box
              sx={{
                flex: "1 1 48%",
                bgcolor: "white",
                p: 2,
                borderRadius: 2,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Booking Amount
              </Typography>
              <Typography variant="h4" color="primary">
                $607,360
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box component={Paper} sx={{ mt: 4, borderRadius: 2 }}>
        <Typography
          variant="h8"
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span> Latest Users</span>
          <span> More</span>
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f3f5" }}>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email-Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ marginRight: "8px" }}>
                        {user.username.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {user.firstname + " " + user.lastname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{user.email}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.phonenumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        backgroundColor: "#d1fadf",
                        color: "#37b467",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {user.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="text"
                        startIcon={<EditIcon />}
                        sx={{ textTransform: "none", color: "gray" }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DashboardPage;
