import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  Chip,
  Paper,
  IconButton,
  Modal,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { apiUrl } from "../../utils/api";
import {
  showNotification,
  hideNotification,
} from "../../redux/notificationSlice";
import { sessionCreated } from "../../redux/sessionSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const CreateSession = () => {
  const [sessionName, setSessionName] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionTags, setSessionTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [modalState, setModalState] = useState(false);
  const [sessionLink, setSessionLink] = useState("this is a trial text");
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const sessionData = useSelector((state) => state.session.currentSession);

  const handleAddTag = () => {
    if (tagInput.trim() && !sessionTags.includes(tagInput.trim())) {
      setSessionTags([...sessionTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSessionTags(sessionTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      alert("Please enter a session name");
      return;
    }

    if (!sessionDescription.trim()) {
      alert("Please enter session description");
      return;
    }

    try {
      const response = await fetch(apiUrl("/session/create-session"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // needed if using cookies/session
        body: JSON.stringify({
          title: sessionName,
          description: sessionDescription,
          tags: sessionTags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(
          showNotification({
            message: data?.message || "Failed to create a session",
            severity: "error",
          })
        );
        setTimeout(() => {
          dispatch(hideNotification());
        }, 3000);
        return;
      }

      await dispatch(sessionCreated(data.session));
      dispatch(
        showNotification({
          message: "Session created successfully",
          severity: "success",
        })
      );
      setTimeout(() => {
        dispatch(hideNotification());
      }, 2000);

      setSessionId(data.session.sessionId);
      setSessionLink(
        `${window.location.origin}/session/${data.session.sessionId}`
      );
      setModalState(true);

      // Optionally navigate to session page
      // navigate(`/session/${data.session.sessionId}`);
    } catch (error) {
      dispatch(
        showNotification({
          message: "Session creation failed",
          severity: "error",
        })
      );
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      return;
    }

    // Reset form after creation
    setSessionName("");
    setSessionDescription("");
    setSessionTags([]);
    setTagInput("");
  };

  const handleCopySessionLink = async () => {
    try {
      await navigator.clipboard.writeText(sessionLink);
      dispatch(
        showNotification({
          message: "Link Copied",
          severity: "success",
        })
      );
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      setModalState(false);
      navigate(`/session/${sessionId}`);
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error copying Link",
          severity: "error",
        })
      );
      setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 2 }}>
      <Paper elevation={5} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          Create New Session
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 1 }}
        >
          Set up a new coding session with a name and relevant tags
        </Typography>

        <Stack spacing={2}>
          {/* Session Name Field */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Session Title
            </Typography>
            <TextField
              fullWidth
              label="Session Name"
              variant="outlined"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name (e.g., 'React Hooks Tutorial')"
              required
            />
          </Box>

          {/* Session Description Field */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Session Description
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Add about the problem you will be disucssing with others
            </Typography>
            <TextField
              fullWidth
              label="Add Description"
              variant="outlined"
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Session Description"
              size="small"
              multiline
              rows={4}
            />
          </Box>

          {/* Session Tags Field */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Session Tags
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Add relevant tags to help categorize your session
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Tag"
                variant="outlined"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tag and press Enter or click Add"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleAddTag}
                startIcon={<AddIcon />}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </Box>

            {/* Display Tags */}
            {sessionTags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {sessionTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    deleteIcon={<CloseIcon />}
                    variant="filled"
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Create Button */}
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateSession}
              disabled={!sessionName.trim() || !sessionDescription.trim()}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                minWidth: "200px",
              }}
            >
              Create Session
            </Button>
          </Box>
          <Modal
            open={modalState}
            onClose={() => setModalState(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#ffffff",
                boxShadow: 5,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Session Created Successfully
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                Copy the below link to invite others to the session
              </Typography>
              <Box
                sx={{ pt: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <TextField
                  disabled
                  size="small"
                  fullWidth
                  value={sessionLink}
                />
                <ContentCopyIcon
                  sx={{
                    color: "#916464",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#000",
                    },
                  }}
                  onClick={handleCopySessionLink}
                />
              </Box>
            </Box>
          </Modal>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateSession;
