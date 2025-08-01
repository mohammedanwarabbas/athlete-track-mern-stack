// description: This code defines a React component for adding or editing workouts for user:athlete, including fetching existing workout data when editing, and displaying a modal for workout management.
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import Loader from "./../../components/ui/Loader";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Add as AddIcon, History as HistoryIcon } from "@mui/icons-material";
import WorkoutModal from "../../components/common/WorkoutModal";

const AddWorkout = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(!!editId);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (editId) {
      const fetchWorkout = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/athlete/workouts/${editId}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          setWorkout(res.data);
          setModalOpen(true); // Only auto-open modal when editing
        } catch (err) {
          toast.error("Failed to load workout");
        } finally {
          setLoading(false);
        }
      };
      fetchWorkout();
    }
  }, [editId, user.token]);

  const handleSubmitSuccess = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {!editId && (
        <Paper
          elevation={3}
          sx={{ p: 3, maxWidth: 600, mx: "auto", textAlign: "center" }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Workout Management
          </Typography>

          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              size="large"
              sx={{ py: 2, px: 4 }}
            >
              Add New Workout
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<HistoryIcon />}
              onClick={() => navigate("/athlete/workout-history")}
              size="large"
              sx={{ py: 2, px: 4 }}
            >
              View History
            </Button>
          </Stack>
        </Paper>
      )}

      <WorkoutModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (editId) {
            navigate("/athlete/workout-history");
          }
        }}
        onSubmit={handleSubmitSuccess}
        workout={workout}
        mode={editId ? "edit" : "add"}
      />
    </Box>
  );
};

export default AddWorkout;
