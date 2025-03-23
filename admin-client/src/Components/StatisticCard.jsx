import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';


const StatisticCard = ({ title, value, total, percentage, isPositive }) => {
    
  return (
    <Card
      sx={{
        boxShadow: 1,
        borderRadius: 2,
     
        backgroundColor: '#fff',
       
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle2"
      
          color="textSecondary"
          gutterBottom
        >
          {title}
        </Typography>
        <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <Typography variant="h4" fontWeight="bold" color="textPrimary">
          {value}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: '#666', marginLeft: 1 }}
          >
            from {total}
          </Typography>
        </Typography>
        <Box display="flex" alignItems="center" marginTop={1.8}  >
          {isPositive ? (
            <TrendingUp sx={{ color: '#10b981', }} />
          ) : (
            <TrendingDown sx={{ color: '#e11d48',  }} />
          )}
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
              color: isPositive ? '#10b981' : '#e11d48',
            }}
          >
            {percentage}%
          </Typography>
        </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


export default StatisticCard
