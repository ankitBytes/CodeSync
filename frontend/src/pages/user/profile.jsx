import {
  Box,
  Grid,
  Avatar,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentUserData } from "../../redux/userSlice";
import { apiUrl } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [profileData, setProfileData] = useState(null);

  // Helper function to extract username from LinkedIn URL
  const extractLinkedInUsername = (linkedinUrl) => {
    if (!linkedinUrl) return "";
    
    try {
      // Handle different LinkedIn URL formats
      const url = new URL(linkedinUrl);
      const pathParts = url.pathname.split('/').filter(part => part);
      
      // LinkedIn profile URLs typically have /in/username format
      if (pathParts.includes('in') && pathParts.length > 1) {
        const usernameIndex = pathParts.indexOf('in') + 1;
        return pathParts[usernameIndex] || "";
      }
      
      // Fallback: try to get the last meaningful part of the path
      return pathParts[pathParts.length - 1] || "";
    } catch {
      // If URL parsing fails, try simple string manipulation
      if (linkedinUrl.includes('/in/')) {
        const parts = linkedinUrl.split('/in/');
        if (parts.length > 1) {
          // Remove any trailing slashes or query parameters
          return parts[1].split('/')[0].split('?')[0];
        }
      }
      return linkedinUrl; // Return original if parsing fails
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = currentUser?.user?.id ?? currentUser?.id;
    if (!userId) return;

    const fetchProfileData = async () => {
      const response = await fetch(apiUrl(`/user/profile/${userId}`), {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        console.log("Fetched profile data:", data.profile);
        dispatch(setCurrentUserData(data.profile)); // Update Redux state with profile data
      } else {
        console.error("Failed to fetch profile data");
      }
    };
    try {
      fetchProfileData();
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }, [currentUser]);

  const recentSessions = [
    {
      id: 1,
      title: "React Hooks Deep Dive",
      aiSummary: "Covered useState, useEffect, and custom hooks.",
    },
    {
      id: 2,
      title: "Node.js API Design",
      aiSummary: "Built REST API with Express and integrated MongoDB.",
    },
  ];

  return (
    <Box sx={{ p: 3, overflow: "hidden" }}>
      <Grid container spacing={4} maxWidth={"lg"} mx="auto">
        {/* Left Column - Profile Info */}
        <Grid
          item
          size={4}
          sx={{
            padding: "20px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            borderRadius: 2,
            height: "80vh",
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Avatar
              alt="Profile"
              src={profileData?.profilePicture || ""}
              sx={{ width: 100, height: 110, borderRadius: "5%" }}
            >
              {profileData?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ ml: 2, textAlign: "left" }}>
              <Typography variant="h5">
                {profileData?.name || "Unnamed User"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {profileData?.designation || "No Designation"}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              {profileData?.about || "No about information available"}
            </Typography>
            <Button
              variant="outlined"
              sx={{ my: 2, width: "100%" }}
              onClick={() =>
                navigate("/profile/update/" + currentUser?.user?.id)
              }
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: profileData?.workingAt ? "flex" : "none", alignItems: "center", gap: 1 }}
            >
              <WorkIcon sx={{ fontSize: "1.2rem" }} />
              {profileData?.workingAt || "College not available"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              onClick={() => window.open(profileData?.linkedin, "_blank")}
              sx={{
                display: profileData?.linkedin ? "flex" : "none",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  color: "black",
                },
              }}
            >
              <LinkedInIcon sx={{ fontSize: "1.2rem" }} />
              {extractLinkedInUsername(profileData?.linkedin)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: profileData?.skills?.length > 0 ? "flex" : "none",
                alignItems: "center",
                gap: 1,
              }}
            >
              <BookmarkIcon sx={{ fontSize: "1.2rem" }} />
              {profileData?.skills?.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    sx={{
                      margin: "0.1px",
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                  >
                    {skill}
                  </Button>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No skills added
                </Typography>
              )}
            </Typography>
          </Box>
        </Grid>

        {/* Right Column - AI Summary & Sessions */}
        <Grid
          item
          size={8}
          sx={{
            padding: "20px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            borderRadius: 2,
            height: "80vh",
          }}
        >
          {/* AI Summary */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              boxShadow:
                "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">AI Summary of All Sessions</Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Replace with AI-generated text */}
              You have completed 12 sessions covering React, Node.js, and
              collaborative coding techniques.
            </Typography>
          </Box>

          {/* Recent Sessions Table */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Recent Sessions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Session Title</TableCell>
                    <TableCell>AI Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>{session.aiSummary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
