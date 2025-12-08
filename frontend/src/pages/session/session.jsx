import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import socket from "../../utils/socket";

// different components
import SessionNavbar from "../../components/session/sessionNavbar";
import Output from "../../components/session/output";
import ProblemDescription from "../../components/session/problemStatement";
import Chat from "../../components/session/chat";
import CodeEditor from "../../components/session/codeEditor";

const Session = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  socket.on("connect", () => {
    console.log("Socket connected in session page");
  })

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0a0a0a",
        height: "100vh",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Session Header */}
      <SessionNavbar />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Left Panel - Problem & Chat */}
          <Grid item xs={12} xl={4} size={4} overflowY={"scroll"}>
            <Stack spacing={2} sx={{ height: "100%", overflowY: "hidden" }}>
              <ProblemDescription />
              <Chat />
            </Stack>
          </Grid>

          {/* Right Panel - Code Editor & Output */}
          <Grid item xs={12} xl={8} size={8}>
            <Stack spacing={2} sx={{ height: "100%" }}>
              <CodeEditor />
              <Output />
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            backgroundColor:
              snackbar.severity === "success"
                ? "#00ff88"
                : snackbar.severity === "error"
                ? "#ff6b6b"
                : snackbar.severity === "warning"
                ? "#ffd93d"
                : "#4ecdc4",
            color:
              snackbar.severity === "success" || snackbar.severity === "warning"
                ? "#000"
                : "#fff",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Session;
