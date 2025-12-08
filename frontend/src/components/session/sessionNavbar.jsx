import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  showNotification,
  hideNotification,
} from "../../redux/notificationSlice";
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

// Mock data for demonstration
const mockProblem = {
  id: "prob_001",
  title: "Two Sum",
  difficulty: "Easy",
  category: "Array",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    "2 <= nums.length <= 104",
    "-109 <= nums[i] <= 109",
    "-109 <= target <= 109",
    "Only one valid answer exists.",
  ],
  starterCode: {
    javascript: `function twoSum(nums, target) {
    // Your code here
}`,
    python: `def two_sum(nums, target):
    # Your code here
    pass`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
  },
};

const SessionNavbar = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sessionLink, setSessionLink] = useState(
    "https://codesync.com/session/abc123"
  );
  const elementRef = useRef(null);
  const dispatch = useDispatch();

  // Handle code execution
  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      dispatch(
        showNotification({
          message: "Code executed successfully!",
          severity: "success",
        })
      );
    }, 2000);
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
  };

  // Handle code save
  const handleSaveCode = () => {
    dispatch(
      showNotification({
        message: "Code saved successfully!",
        severity: "success",
      })
    );
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
  };

  // Handle share session
  const handleShareSession = () => {
    navigator.clipboard.writeText(sessionLink);
    dispatch(
      showNotification({
        open: true,
        message: "Session link copied to clipboard!",
        severity: "success",
      })
    );
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
    setShowShareDialog(false);
  };

  const enterFullScreen = () => {
    if (elementRef.current.requestFullscreen) {
      setIsFullscreen(true);
      elementRef.current.requestFullscreen();
    } else if (elementRef.current.webkitRequestFullscreen) {
      // Safari
      setIsFullscreen(true);
      elementRef.current.webkitRequestFullscreen();
    } else if (elementRef.current.msRequestFullscreen) {
      // IE/Edge
      setIsFullscreen(true);
      elementRef.current.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      setIsFullscreen(false);
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      setIsFullscreen(false);
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      setIsFullscreen(false);
      document.msExitFullscreen();
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#1a1a1a",
          borderBottom: "1px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
        ref={elementRef}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#00ff88" }}
              >
                CodeSync
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ backgroundColor: "#333" }}
              />
              <Typography variant="body1" sx={{ color: "#ccc" }}>
                {mockProblem.title} - {mockProblem.difficulty}
              </Typography>
              <Chip
                label={mockProblem.category}
                size="small"
                sx={{ backgroundColor: "#333", color: "#00ff88" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AvatarGroup
                max={3}
                sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
              >
                <Avatar sx={{ bgcolor: "#00ff88", color: "#000" }}>A</Avatar>
                <Avatar sx={{ bgcolor: "#ff6b6b", color: "#fff" }}>B</Avatar>
                <Avatar sx={{ bgcolor: "#4ecdc4", color: "#fff" }}>Y</Avatar>
              </AvatarGroup>

              <Tooltip title="Run Code">
                <IconButton
                  onClick={handleRunCode}
                  disabled={isRunning}
                  sx={{ color: isRunning ? "#fffcfc" : "#00ff88" }}
                >
                  {isRunning ? <StopIcon /> : <RunIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Save Code">
                <IconButton onClick={handleSaveCode} sx={{ color: "#4ecdc4" }}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share Session">
                <IconButton
                  onClick={() => setShowShareDialog(true)}
                  sx={{ color: "#ff6b6b" }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Settings">
                <IconButton
                  onClick={() => setShowSettings(true)}
                  sx={{ color: "#ccc" }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton
                  onClick={() =>
                    isFullscreen ? exitFullScreen() : enterFullScreen()
                  }
                  sx={{ color: "#ccc" }}
                >
                  {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Paper>
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          Share Session
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <TextField
            fullWidth
            value={sessionLink}
            onChange={(e) => setSessionLink(e.target.value)}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                color: "#ccc",
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#555" },
                "&.Mui-focused fieldset": { borderColor: "#00ff88" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1a1a1a" }}>
          <Button
            onClick={() => setShowShareDialog(false)}
            sx={{ color: "#ccc" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleShareSession}
            sx={{
              backgroundColor: "#00ff88",
              color: "#000",
              "&:hover": { backgroundColor: "#00cc6a" },
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          Editor Settings
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
          <Typography variant="body2" sx={{ color: "#ccc", mb: 2 }}>
            Customize your coding experience with these settings.
          </Typography>
          {/* Add more settings here as needed */}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1a1a1a" }}>
          <Button onClick={() => setShowSettings(false)} sx={{ color: "#ccc" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionNavbar;
