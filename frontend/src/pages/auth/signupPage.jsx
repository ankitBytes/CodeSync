import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setEmail, clearEmail } from "../../redux/userSlice";
import { showNotification, hideNotification } from "../../redux/notificationSlice";
import { apiUrl } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#fff"
      paddingTop={"3rem"}
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
          Welcome To CodeSync
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create an account to get started
        </Typography>

        {otpVerified ? (
          <BasicDetails />
        ) : otpSent ? (
          <EnterOTP setOtpVerified={setOtpVerified} />
        ) : (
          <>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <EnterEmail setOtpSent={setOtpSent} />
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>
              Sign up with Google
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account? <a href="/login">Log In</a>
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

const EnterEmail = ({ setOtpSent }) => {
  const [email, setEmailValue] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (!email) {
      dispatch(showNotification({ message: "Please fill in all fields.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      return;
    }

    try {
      const response = await fetch(apiUrl('/auth/sendOtp'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed if using cookies/session
        body: JSON.stringify({ email, purpose: "signup" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      dispatch(setEmail(email)); // store email in Redux
      dispatch(showNotification({ message: "OTP sent to your email.", severity: "success" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      dispatch(showNotification({ message: "Failed to send OTP. Please try again.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      setError(error.message);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <TextField
        label="Email"
        fullWidth
        required
        onChange={(e) => setEmailValue(e.target.value)}
        color={error ? "error" : "secondary"}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={handleSignup}
      >
        Sign Up
      </Button>
    </Box>
  );
};

const EnterOTP = ({ setOtpVerified }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      document.querySelector(`input[name="otp-${index + 1}"]`)?.focus();
    }
  };

  const handleSubmitOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      dispatch(showNotification({ message: "Please enter a 6-digit OTP.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      return;
    }

    try {
      const response = await fetch(apiUrl('/auth/verifyOtp'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed for cookies
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      dispatch(showNotification({ message: "OTP verified successfully!", severity: "success" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      setOtpVerified(true);
    } catch (error) {
      console.log("Error verifying OTP:", error.message);
      dispatch(clearEmail());
      setOtp(["", "", "", "", "", ""]); // reset OTP input
      dispatch(showNotification({ message: "Failed to verify OTP. Please try again.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
    }
  };

  return (
    <Box>
      <Box gap={1} display="flex" justifyContent="center">
        {otp.map((digit, index) => (
          <TextField
            key={index}
            name={`otp-${index}`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              style: { textAlign: "center" },
            }}
            sx={{ width: 40 }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmitOtp}
      >
        Verify OTP
      </Button>
    </Box>
  );
};

const BasicDetails = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email = useSelector((state) => state.user.email);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    function isValidPassword(password) {
      const minLength = /.{12,}/;
      const uppercase = /[A-Z]/;
      const number = /[0-9]/;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

      return (
        minLength.test(password) &&
        uppercase.test(password) &&
        number.test(password) &&
        specialChar.test(password)
      );
    }

    if (!isValidPassword(password)) {
      dispatch(showNotification({ message: "Password must be at least 12 characters long, contain an uppercase letter, a number, and a special character.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      return;
    }

    if (password !== confirmPassword) {
      dispatch(showNotification({ message: "Passwords do not match.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      return;
    }

    try {
      const response = await fetch(apiUrl('/auth/signup'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed for cookies
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 409) {
        dispatch(showNotification({ message: "Email already exists. Please try logging in.", severity: "error" }));
        setTimeout(() => {
          dispatch(hideNotification());
        }, 3000);
        dispatch(clearEmail()); // clear email from Redux
        return navigate("/login");
      }
      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data = await response.json();
      dispatch(loginSuccess(data?.user ?? data));
      dispatch(showNotification({ message: "Signup successful!", severity: "success" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      dispatch(clearEmail()); // clear email from Redux
      window.location.href = "/"; // redirect to home or dashboard
    } catch (error) {
      console.error("Error during signup:", error.message);
      dispatch(showNotification({ message: "Failed to sign up. Please try again.", severity: "error" }));
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
    }
  };
  return (
    <Box gap={2} display={"flex"} flexDirection={"column"} paddingTop={"2rem"}>
      <TextField
        label="Enter Password"
        type="password"
        fullWidth
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Re-enter Password"
        type="password"
        fullWidth
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupPage;
