import React, { useEffect, useState } from "react";
import {
  Box,

} from "@mui/material";


import SliderForCards from "./SliderForCards";
import { getTopPackages } from "../api/TopDestinationApi";

const CustomSlider = () => {

  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getTopPackages(); 
        
        
        setPackages(data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);
  

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <SliderForCards data={packages} heading1={"Featured Tours"} heading2={" Most Popular Tours"} />
    </Box>
  );
};

export default CustomSlider;
