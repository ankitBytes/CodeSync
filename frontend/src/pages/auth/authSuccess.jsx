// src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function AuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      document.cookie = `token=${token}; Secure; SameSite=None; path=/`;
      window.location.href = "/";
    }
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0, 0, 0, 0.567)",
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      <CircularProgress size={64} />
    </Box>
  );
}
