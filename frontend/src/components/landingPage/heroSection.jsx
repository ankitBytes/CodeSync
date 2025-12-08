import React from 'react';
import { Box, Container, Typography, Button } from "@mui/material";
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import FeatureCards from "./featureCards";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HeroSection = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const features = [
    {
      feature: "Live Sync Editing",
      icon: <CloudSyncIcon sx={{ fontSize: "4rem" }} />,
    },
    {
      feature: "AI Code Assistance",
      icon: <SmartToyIcon sx={{ fontSize: "4rem" }} />,
    },
    {
      feature: "Real-time Collaboration",
      icon: <QuestionAnswerIcon sx={{ fontSize: "4rem" }} />,
    },
  ];

  const navigate = useNavigate();
  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{
          textAlign: "center",
          padding: "4rem 0",
        }}
      >
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h1" fontWeight={200} letterSpacing={1.5}>
            CodeSync -{" "}
          </Typography>
          <Typography
            variant="h1"
            fontWeight={200}
            paddingTop={1}
            letterSpacing={1.5}
          >
            Code Together Live
          </Typography>
        </Box>
        <Typography
          variant="h2"
          fontWeight={200}
          letterSpacing={1.5}
          color="#797979"
        >
          [A real-time collaborative code editor]
        </Typography>
        <Box
          sx={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Button 
            sx={{ padding: "0.5% 2%", width: "25%" }} 
            onClick={() => currentUser ? navigate(`/${currentUser.id}/create-session`) : navigate('/login')}
            variant={currentUser ? "contained" : "outlined"}
          >
            {currentUser ? "Start Coding" : "Login to Start Coding"}
          </Button>
          <Button sx={{ padding: "0.5% 2%", width: "25%" }}>Try Demo</Button>
        </Box>
        <Box
          sx={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {features.map((item, key) => {
            return (
              <FeatureCards
                key={key}
                feature={item.feature}
                icon={item.icon}
              />
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
