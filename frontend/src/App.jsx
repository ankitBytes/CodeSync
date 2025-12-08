import React, { useMemo, useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { Routes, Route, Outlet } from "react-router-dom";
import NavBar from "./components/navbar";
import LandingPage from "./pages/landing.jsx";
import LoginPage from "./pages/auth/login.jsx";
import SignupPage from "./pages/auth/signupPage.jsx";
import Profile from "./pages/user/profile.jsx";
import ProfileUpdate from "./pages/user/updateProfile.jsx";
import CreateSession from "./pages/session/createSession.jsx";
import Session from "./pages/session/session.jsx";
import AuthSuccess from "./pages/auth/authSuccess.jsx";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setCurrentUserData,
} from "./redux/userSlice";
import Loader from "./components/loader";
import { useSelector } from "react-redux";
import "./utils/httpClient";
import { apiUrl } from "./utils/api";
import GlobalSnackbar from "./components/GlobalSnackbar";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import ForgotPassword from "./pages/auth/forgotPassword.jsx";

function App() {
  const [mode, setMode] = useState("light"); // toggleable
  const dispatch = useDispatch();
  const isGlobalLoading = useSelector((state) => state.loading.pendingRequests > 0);
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );
  // const socket = io("ws://localhost:3000");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // socket.on("connect", () => {
  //   console.log("Socket.Io connected successfully");
  // });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(apiUrl("/auth/me"), {
          headers: authHeaders,
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          const authUser = user?.user ?? user;
          dispatch(loginSuccess(authUser));
          setCurrentUser(authUser);

          // ✅ Fetch profile only after auth success
          await fetchProfileData(authUser?.id);
        } else {
          dispatch(logout());
          setIsLoading(false); // 👈 End loading even if not authenticated
        }
      } catch (err) {
        dispatch(logout());
        setIsLoading(false);
        console.error("Error checking authentication:", err);
      }
    };

    const fetchProfileData = async (userId) => {
      try {
        const token = localStorage.getItem("token");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(
          apiUrl(`/user/profile/${userId}`),
          {
            headers: authHeaders,
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.profile);
          dispatch(setCurrentUserData(data.profile));
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false); // 👈 End loading once done
      }
    };

    checkAuth();
  }, [dispatch]);

  // Remove page-blocking gate; use global overlay instead

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Loader />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isGlobalLoading && <Loader />}
      <GlobalSnackbar />
      <Routes>
        {/* ✅ NavBar only renders AFTER loading is done */}
        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={<LandingPage mode={mode} setMode={setMode} />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="success" element={<AuthSuccess />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/profile/update/:id"
            element={currentUser ? <ProfileUpdate /> : <LoginPage />}
          />
          <Route path="/:id/create-session" element={<CreateSession />} />
          <Route path="/session/:sessionId" element={<Session />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

const RootLayout = () => {
  const location = useLocation();

  // Hide navbar when route matches /session/:sessionId
  const hideNavbar = location.pathname.startsWith("/session/");

  return (
    <>
      {!hideNavbar && <NavBar />}
      <Outlet />
    </>
  );
};

export default App;
