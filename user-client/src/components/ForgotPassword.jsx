import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Email is required.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      setMessage(response.msg);
      setTimeout(() => {
        navigate(`/verify-otp/${email}`);
      }, 2000);
    } catch (error) {
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <Typography variant="h5" align="center">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="#FF7A00"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="secondary" /> : 'Send OTP'}
        </Button>
      </form>
      {message && <Typography color="error" align="center">{message}</Typography>}
    </div>
  );
};

export default ForgotPassword;
