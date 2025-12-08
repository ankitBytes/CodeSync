// src/pages/ProfileUpdate.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../utils/api";

const ProfileUpdate = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const profileData = useSelector((state) => state.user.currentUserData);
  const navigate = useNavigate();
  const userId = currentUser?.user?.id ?? currentUser?.id;

  const [formData, setFormData] = useState({
    name: profileData?.name || "",
    username: profileData?.username || "",
    designation: profileData?.designation || "",
    workingAt: profileData?.workingAt || "",
    linkedin: profileData?.linkedin || "",
    skills: profileData?.skills ? profileData.skills.join(", ") : "",
    about: profileData?.about || "",
    profilePicture: profileData?.profilePicture || "", // Existing image URL
    image: null, // New image file
  });

  const [imagePreview, setImagePreview] = useState(
    profileData?.profilePicture || ""
  );

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file })); // store file object
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "skills") {
          formDataToSend.append(
            "skills",
            JSON.stringify(
              formData.skills.split(",").map((skill) => skill.trim())
            )
          );
        } else if (key !== "image") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append file ONLY if it’s a File object
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      await axios.put(
        apiUrl(`/user/update_profile/${userId}`),
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully!");
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Update Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Avatar Upload */}
          <Grid item xs={12} sm={4}>
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={imagePreview}
                alt="Profile"
                sx={{ width: 100, height: 110, borderRadius: "0" }}
              />
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Stack>
          </Grid>

          {/* Profile Fields */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Display Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="College"
              name="workingAt"
              value={formData.workingAt}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Skills (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Bio"
              name="about"
              value={formData.about}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProfileUpdate;
