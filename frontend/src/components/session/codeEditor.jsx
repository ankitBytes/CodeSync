import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { showNotification, hideNotification } from "../../redux/notificationSlice";
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

const mockTestCases = [
  {
    id: 1,
    input: "[2,7,11,15], 9",
    expectedOutput: "[0,1]",
    actualOutput: "[0,1]",
    status: "passed",
  },
  {
    id: 2,
    input: "[3,2,4], 6",
    expectedOutput: "[1,2]",
    actualOutput: "[1,2]",
    status: "passed",
  },
  {
    id: 3,
    input: "[3,3], 6",
    expectedOutput: "[0,1]",
    actualOutput: "[0,1]",
    status: "passed",
  },
];
const CodeEditor = () => {
  const [code, setCode] = useState(mockProblem.starterCode.javascript);
  const [socket, setSocket] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sessionLink, setSessionLink] = useState(
    "https://codesync.com/session/abc123"
  );
  const [chatMessage, setChatMessage] = useState("");
  const [testResults] = useState(mockTestCases);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const elementRef = useRef(null);
  const dispatch = useDispatch();

  // Handle code execution
  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
      dispatch(showNotification({
        message: "Code executed successfully!",
        severity: "success",
      }));
    }, 2000);
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
  };

  // Handle code save
  const handleSaveCode = () => {
    dispatch(showNotification({
      message: "Code saved successfully!",
      severity: "success",
    }));
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
  };

  // Handle share session
  const handleShareSession = () => {
    navigator.clipboard.writeText(sessionLink);
    dispatch(showNotification({
      open: true,
      message: "Session link copied to clipboard!",
      severity: "success",
    }));
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
    setShowShareDialog(false);
  };

  // Handle chat message
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Add message to chat
      setChatMessage("");
      setSnackbar({
        open: true,
        message: "Message sent!",
        severity: "info",
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #333",
        height: "50vh",
        display: "flex",
        flexDirection: "column",
      }}
      ref={elementRef}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "#00ff88" }}>
            <CodeIcon sx={{ mr: 1, fontSize: "1rem" }} />
            Code Editor
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: "#999" }}>Language</InputLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                color: "#ccc",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#333",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00ff88",
                },
              }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={<BugIcon />}
            label="Debug"
            size="small"
            sx={{ backgroundColor: "#333", color: "#ccc" }}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2, height: "100%", overflow: "hidden" }}>
        <Editor
          defaultLanguage="javascript"
          theme="vs-dark"
          height={"100%"}
          value={code}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </Box>
    </Paper>
  );
};

export default CodeEditor;
