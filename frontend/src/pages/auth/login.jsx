import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/userSlice";
import {
  showNotification,
  hideNotification,
} from "../../redux/notificationSlice";
import { apiUrl } from "../../utils/api";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSigninWithGoogle = (e) => {
    e.preventDefault();
    window.location.href = apiUrl("/auth/google");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed if using cookies/session
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 401) {
        dispatch(
          showNotification({
            message: "Invalid email or password. Please try again.",
            severity: "error",
          })
        );
        setTimeout(() => {
          dispatch(hideNotification());
        }, 3000);
        return;
      }

      `if (!response.ok)
        throw new Error(data.message || "Something went wrong.");`

      dispatch(loginSuccess(data?.user ?? data)); // normalize shape
      dispatch(
        showNotification({ message: "Login successful!", severity: "success" })
      );
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      window.location.href = "/"; // redirect to home or dashboard
    } catch (error) {
      dispatch(
        showNotification({
          message: "Failed to login. Please try again.",
          severity: "error",
        })
      );
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingTop={"5rem"}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 350,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Welcome Back
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Please login to your account
        </Typography>

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            fullWidth
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={(e) => handleSigninWithGoogle(e)}
        >
          Sign in with Google
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <a href="/signup">Sign up</a>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Forgot your password? <a href="/forgot-password">Reset password</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
