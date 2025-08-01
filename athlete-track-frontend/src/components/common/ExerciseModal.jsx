// description: This code defines a modal component for creating or editing exercises for admin.
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "500px" },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

const ExerciseModal = ({ open, onClose, onSuccess, exercise, mode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    caloriesPerMin: "",
  });

  useEffect(() => {
    if (mode === "edit" && exercise) {
      setFormData({
        name: exercise.name,
        caloriesPerMin: exercise.caloriesPerMin,
      });
    } else {
      setFormData({
        name: "",
        caloriesPerMin: "",
      });
    }
  }, [mode, exercise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.caloriesPerMin) {
        throw new Error("Name and calories per minute are required");
      }

      const data = {
        name: formData.name.trim(),
        caloriesPerMin: parseFloat(formData.caloriesPerMin),
      };

      let response;
      if (mode === "edit") {
        response = await axios.put(
          `${API_BASE_URL}/api/admin/exercises/${exercise._id}`,
          data,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/admin/exercises`,
          data,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }

      onSuccess(response.data);
      toast.success(
        mode === "edit"
          ? "Exercise updated successfully!"
          : "Exercise created successfully!"
      );
      onClose();
    } catch (error) {
      if (error.response?.data?.isDeleted) {
        // Handle the case where exercise exists but is deleted
        toast.info(error.response.data.errorMessage);
      } else {
        toast.error(
          error.response?.data?.errorMessage ||
            error.message ||
            "Failed to save exercise"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="exercise-modal-title">
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography id="exercise-modal-title" variant="h6" component="h2">
            {mode === "edit" ? "Edit Exercise" : "Create New Exercise"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            sx={{ mb: 3 }}
            label="Exercise Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            inputProps={{
              maxLength: 25,
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: "0.75rem", // Smaller text
                textAlign: "right", // Align to right
                mt: 0.5, // Reduce top margin
              },
            }}
            helperText={`Max 25 characters (${formData.name.length}/25)`}
          />

          <TextField
            fullWidth
            sx={{ mb: 3 }}
            label="Calories Per Minute"
            type="number"
            name="caloriesPerMin"
            value={formData.caloriesPerMin}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0.1" }}
            required
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : mode === "edit" ? (
                "Update Exercise"
              ) : (
                "Create Exercise"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ExerciseModal;
