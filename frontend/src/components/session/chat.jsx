import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  AvatarGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  PlayArrow as RunIcon,
  Stop as StopIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as ExitFullscreenIcon,
  Chat as ChatIcon,
  Code as CodeIcon,
  BugReport as BugIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { io } from "socket.io-client";


const mockChatMessages = [
  {
    id: 1,
    user: "Alice",
    message: "I think we should use a hash map approach",
    timestamp: "2:30 PM",
    avatar: "A",
  },
  {
    id: 2,
    user: "Bob",
    message: "Good idea! That would give us O(n) time complexity",
    timestamp: "2:32 PM",
    avatar: "B",
  },
  {
    id: 3,
    user: "You",
    message: "Let me implement that solution",
    timestamp: "2:35 PM",
    avatar: "Y",
  },
];


const Chat = () => {
  const [chatMessage, setChatMessage] = useState("");
  // const socket = io("ws://localhost:3000");

  // Handle chat message
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Add message to chat
      setChatMessage("");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #333",
        height: "36vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 1, borderBottom: "1px solid #333" }}>
        <Typography variant="subtitle1" sx={{ color: "#00ff88" }}>
          <ChatIcon sx={{ mr: 1, fontSize: "1rem" }} />
          Live Chat
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {mockChatMessages.map((msg) => (
          <Box key={msg.id} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  fontSize: "0.8rem",
                }}
              >
                {msg.avatar}
              </Avatar>
              <Typography variant="caption" sx={{ color: "#999" }}>
                {msg.user} • {msg.timestamp}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#ccc", ml: 3 }}>
              {msg.message}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 1, borderTop: "1px solid #333" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Type a message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                color: "#ccc",
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#555" },
                "&.Mui-focused fieldset": { borderColor: "#00ff88" },
              },
              "& .MuiInputBase-input": { color: "#ccc" },
              "& .MuiInputLabel-root": { color: "#999" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{
              backgroundColor: "#00ff88",
              color: "#000",
              "&:hover": { backgroundColor: "#00cc6a" },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Chat;
