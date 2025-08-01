// description: This code defines a modal component for logging or editing workouts for user:athlete, including fetching exercises and handling form submission.
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "600px" },
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

const WorkoutModal = ({ open, onClose, onSubmit, workout, mode }) => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    exercise: "",
    duration: 30,
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm"),
    notes: "",
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/athlete/exercises`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExercises(res.data);
      } catch (err) {
        toast.error(
          err.response?.data?.errorMessage || "Failed to load exercises"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();

    if (mode === "edit" && workout) {
      const localDate = moment(workout.date).local();
      setFormData({
        exercise: workout.exercise._id,
        duration: workout.duration,
        date: localDate.format("YYYY-MM-DD"),
        time: localDate.format("HH:mm"),
        notes: workout.notes || "",
      });
    }

    if (mode === "add") {
      setFormData({
        exercise: "",
        duration: 30,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm"),
        notes: "",
      });
    }
  }, [mode, workout, user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine date and time from form
      const dateTimeString = `${formData.date}T${formData.time}`;
      // Create Date object from local time
      const localDate = new Date(dateTimeString);
      // Convert to ISO string (UTC)
      const isoDate = localDate.toISOString();

      console.log("Form data:", formData);
      console.log("Converted date:", isoDate);

      const workoutData = {
        exercise: formData.exercise,
        duration: Number(formData.duration),
        date: isoDate,
        notes: formData.notes,
      };

      console.log("Submitting workout data:", workoutData);

      let response;
      if (mode === "edit") {
        response = await axios.put(
          `${API_BASE_URL}/api/athlete/workouts/${workout._id}`,
          workoutData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/api/athlete/workouts`,
          workoutData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }

      onSubmit(response.data.workout);
      toast.success(
        mode === "edit"
          ? "Workout updated successfully!"
          : "Workout logged successfully!"
      );

      if (mode === "edit") {
        onClose();
      } else {
        // Reset form but keep it open for new entries
        setFormData({
          exercise: "",
          duration: 30,
          date: moment().format("YYYY-MM-DD"),
          time: moment().format("HH:mm"),
          notes: "",
        });
      }
    } catch (err) {
      console.error("Error saving workout:", err);
      toast.error(err.response?.data?.errorMessage || "Failed to save workout");
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="workout-modal-title">
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography id="workout-modal-title" variant="h6" component="h2">
            {mode === "edit" ? "Edit Workout" : "Log New Workout"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="exercise-label">Exercise</InputLabel>
              <Select
                labelId="exercise-label"
                id="exercise"
                name="exercise"
                value={formData.exercise}
                label="Exercise"
                onChange={handleChange}
                required
              >
                {exercises.map((exercise) => (
                  <MenuItem key={exercise._id} value={exercise._id}>
                    {exercise.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              sx={{ mb: 3 }}
              label="Duration (minutes)"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              inputProps={{ min: 1, max: 600 }}
              FormHelperTextProps={{
                sx: {
                  fontSize: "0.75rem", // Smaller text
                  textAlign: "right", // Align to right
                  mt: 0.5,
                  color:
                    formData.duration < 0 || formData.duration > 600
                      ? "error.main"
                      : "",
                },
              }}
              helperText={`duration range: 1min to 600mins`}
            />

            <Box display="flex" gap={2} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>

            <TextField
              fullWidth
              sx={{ mb: 3 }}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              inputProps={{ maxLength: 200 }}
              FormHelperTextProps={{
                sx: {
                  fontSize: "0.75rem", // Smaller text
                  textAlign: "right", // Align to right
                  mt: 0.5,
                  color: formData.notes.length > 200 ? "error.main" : "",
                },
              }}
              helperText={`Max 200 characters (${formData.notes.length}/200)`}
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {mode === "edit" ? "Update Workout" : "Log Workout"}
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default WorkoutModal;
