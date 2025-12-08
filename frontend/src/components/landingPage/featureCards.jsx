import React from 'react';
import { Box, Container, Typography, Button } from "@mui/material";

const FeatureCards = ({ feature, icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4rem 2rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        minWidth: "400px",
        boxShadow:
          "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
      }}
    >
      {icon}
      <Typography variant="h3" paddingTop={"2rem"}>
        {feature}
      </Typography>
    </Box>
  );
};

export default FeatureCards;
