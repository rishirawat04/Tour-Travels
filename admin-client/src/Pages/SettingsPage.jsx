import React from "react";
import { Box, Grid, Typography, Button, Card, CardContent } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ImageIcon from "@mui/icons-material/Image";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";

const settingsData = [
  {
    icon: <SettingsIcon fontSize="large" color="primary" />,
    title: "Basic Control",
    description: "Basic such as, site title, timezone, currency, notifications, verifications and so on.",
    link: "Change Setting",
  },
  {
    icon: <ImageIcon fontSize="large" color="primary" />,
    title: "Logo",
    description: "Logo settings such as, logo, footer logo, admin logo, favicon, breadcrumb.",
    link: "Change Setting",
  },
  {
    icon: <NotificationsNoneIcon fontSize="large" color="primary" />,
    title: "Push Notification",
    description: "Push notification settings such as, firebase configuration and push notification templates.",
    link: "Change Setting",
  },
  {
    icon: <NotificationsActiveIcon fontSize="large" color="primary" />,
    title: "In App Notification",
    description: "In app notification settings such as, pusher configuration and in app notification templates.",
    link: "Change Setting",
  },
  {
    icon: <EmailIcon fontSize="large" color="primary" />,
    title: "Email",
    description: "Email settings such as, email configuration and email templates.",
    link: "Change Setting",
  },
  {
    icon: <SmsIcon fontSize="large" color="primary" />,
    title: "SMS",
    description: "SMS settings such as, SMS configuration and SMS templates.",
    link: "Change Setting",
  },
];

const SettingsPage = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {settingsData.map((setting, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                "&:hover": {

                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>{setting.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {setting.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {setting.description}
                </Typography>
                <Button variant="text" sx={{ color: "#1976d2", fontWeight: "bold" }}>
                  {setting.link} &gt;
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SettingsPage;
