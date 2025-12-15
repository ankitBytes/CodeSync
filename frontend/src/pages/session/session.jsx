import React, { useState, useEffect, use } from "react";
import { Box, Container, Grid, Stack, Alert, Snackbar, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../utils/api.js";
import { useDispatch } from "react-redux";
import { sessionCreated, clearSession } from "../../redux/sessionSlice.js";

// different components
import SessionNavbar from "../../components/session/sessionNavbar";
import Output from "../../components/session/output";
import ProblemDescription from "../../components/session/problemStatement";
import Chat from "../../components/session/chat";
import CodeEditor from "../../components/session/codeEditor";

const Session = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isSessionValid, setIsSessionValid] = useState(false);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const verifySession = async () => {
      try {
        const response = await fetch(
          apiUrl(`/session/verify-session/${sessionId}`),
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Session verification failed");
        }

        const data = await response.json();
        setIsSessionValid(true);
        if (cancelled) return;

        console.log(data.session);  

        dispatch(sessionCreated(data.session));
        setSnackbar({
          open: true,
          severity: "success",
          message: "Joined the session successfully",
        });
        setTimeout(() => {
          dispatch(hideNotification());
        }, 3000);
      } catch (error) {
        if (cancelled) return;

        dispatch(clearSession());
        setSnackbar({
          open: true,
          severity: "error",
          message: "Invalid or expired session",
        });
        setTimeout(() => {
          dispatch(hideNotification());
        }, 3000);
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [sessionId, dispatch]);

  return (
    <Box
      sx={{
        backgroundColor: "#0a0a0a",
        height: "100vh",
        color: "white",
        overflow: "hidden",
      }}
    >
      {isSessionValid ? (
        <>
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
        </>
      ) : (
        <>
          {" "}
          <Typography color="white" variant="h4" align="center">Invalid Session</Typography>
        </>
      )}
      {/* Session Header */}

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
