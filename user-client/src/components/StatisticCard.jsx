import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';



const StatisticCard = ({ title, value }) => {
    
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
     
        </Typography>
        <Box display="flex" alignItems="center" marginTop={1.8}  >
         
          <Typography
            variant="body2"
           
            sx={{
              color: '#888',
            }}
          >
          All Time
          </Typography>
        </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


export default StatisticCard
