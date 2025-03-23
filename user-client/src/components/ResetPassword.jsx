import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';

import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';

const ResetPassword = () => {
  const { email } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setMessage('New password is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({ email, newPassword });
      setMessage(response.msg);
      setTimeout(() => {
        navigate('/signin'); 
      }, 2000);
    } catch (error) {
      setMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <Typography variant="h5" align="center">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="#FF7A00"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="secondary" /> : 'Reset Password'}
        </Button>
      </form>
      {message && <Typography color="error" align="center">{message}</Typography>}
    </div>
  );
};

export default ResetPassword;
