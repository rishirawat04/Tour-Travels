import React from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";

const PaymentInfoModal = ({ open, onClose, onApprove, onReject, payment }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" textAlign="center" mb={2}>
          Payment Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Transaction ID:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {payment?.transactionId || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" fontWeight="bold">
              Amount:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2">
              {payment?.amount?.$numberDecimal || "N/A"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 2,
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" color="success" onClick={onApprove}>
            Approve
          </Button>
          <Button variant="contained" color="error" onClick={onReject}>
            Reject
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentInfoModal;

