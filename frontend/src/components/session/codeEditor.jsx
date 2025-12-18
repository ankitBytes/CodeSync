import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useSocket } from "../../utils/socketContext";
import { useDispatch, useSelector } from "react-redux";
import {
  showNotification,
  hideNotification,
} from "../../redux/notificationSlice";
import {
  Box,
  Typography,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const CodeEditor = () => {
  const [code, setCode] = useState(mockProblem.starterCode.javascript);
  const [language, setLanguage] = useState("javascript");
  const elementRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  const sessionId = useSelector(
    (state) => state.session.currentSession?.sessionId
  );
  const userId = useSelector((state) => state.user.currentUser?.id);
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.on("session:code:update", ({ code, language }) => {
      isRemoteUpdate.current = true;
      setCode(code);
      setLanguage(language);
    });

    return () => {
      socket.off("session:code:update");
    };
  }, [socket]);

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
          value={code}
          language={language}
          theme="vs-dark"
          onChange={(value) => {
            setCode(value);
            console.log("Code changed:", value);
            if (isRemoteUpdate.current) {
              isRemoteUpdate.current = false;
              return;
            }
            socket.emit("session:code:change", {
              sessionId,
              userId,
              code: value,
              language,
            });
          }}
        />
      </Box>
    </Paper>
  );
};

export default CodeEditor;
