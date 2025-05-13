import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';

import { useParams, useNavigate } from 'react-router-dom';
import { verifyPasswordOTP } from '../api/auth';

const VerifyOTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage('OTP is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyPasswordOTP({ email, code: otp });
      setMessage(response.msg);
      setTimeout(() => {
        navigate(`/reset-password/${email}`); 
      }, 2000);
    } catch (error) {
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <Typography variant="h5" align="center">Verify OTP</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter OTP"
          type="text"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: "#FF7A00",
            '&:hover': {
              backgroundColor: "#E86E00"
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
        </Button>
      </form>
      {message && <Typography color="error" align="center">{message}</Typography>}
    </div>
  );
};

export default VerifyOTP;
