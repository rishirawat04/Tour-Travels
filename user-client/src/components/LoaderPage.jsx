import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoaderPage = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3faf7",
      }}
    >
      <CircularProgress
        size={60}
        thickness={4.5}
        sx={{ color: "#FF7A00", marginBottom: 2 }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "#666",
          fontWeight: "500",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoaderPage;
