// description: This code defines a React component for viewing and managing workout history for user:athlete, including features like searching, sorting, pagination, and editing workouts.
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import Loader from "../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  Whatshot as WhatshotIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import WorkoutModal from "../../components/common/WorkoutModal";
import moment from "moment";

const WorkoutHistory = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteDialog, setNoteDialog] = useState({ open: false, content: "" });
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
    type: "date-desc",
  });
  const isMobile = useMediaQuery("(max-width:600px)");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkouts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage);

  // Pagination component
  const PaginationControls = () => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      mt={3}
      gap={2}
    >
      <IconButton
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        size="small"
      >
        <ChevronLeftIcon />
      </IconButton>

      <Typography variant="body2">
        {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, filteredWorkouts.length)} of{" "}
        {filteredWorkouts.length}
      </Typography>

      <IconButton
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        size="small"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/athlete/workouts`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setWorkouts(res.data);
        setError(null);
      } catch (err) {
        const errorMsg =
          err.response?.data?.errorMessage || "Failed to load workouts";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [user.token]);

  // Apply search and sorting
  useEffect(() => {
    let results = [...workouts];

    if (searchTerm) {
      results = results.filter(
        (w) =>
          w.exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    results.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === "exercise") {
        aValue = a.exercise.name.toLowerCase();
        bValue = b.exercise.name.toLowerCase();
      } else if (sortConfig.key === "date") {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredWorkouts(results);
    setCurrentPage(1);
  }, [workouts, searchTerm, sortConfig.key, sortConfig.direction]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/athlete/workouts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setWorkouts(workouts.filter((w) => w._id !== id));
      toast.success("Workout deleted");
    } catch (err) {
      toast.error(err.response?.data?.errorMessage || "Delete failed");
    }
  };

  const handleEdit = (workout) => {
    setSelectedWorkout(workout);
    setWorkoutModalOpen(true);
  };

  const handleModalSubmit = (updatedWorkout) => {
    if (selectedWorkout) {
      setWorkouts(
        workouts.map((w) => (w._id === updatedWorkout._id ? updatedWorkout : w))
      );
    }
    setWorkoutModalOpen(false);
  };

  const showFullNote = (note) => {
    setNoteDialog({ open: true, content: note });
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontSize: isMobile ? "1.5rem" : "2rem" }}
      >
        Workout History
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize={isMobile ? "small" : "medium"} />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
          size={isMobile ? "small" : "medium"}
        />

        <FormControl
          sx={{ minWidth: 120 }}
          size={isMobile ? "small" : "medium"}
        >
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortConfig.type}
            onChange={(e) => {
              const [key, direction] = e.target.value.split("-");
              setSortConfig({ key, direction, type: e.target.value });
            }}
            label="Sort By"
          >
            <MenuItem value="date-desc">Date (Newest First)</MenuItem>
            <MenuItem value="date-asc">Date (Oldest First)</MenuItem>
            <MenuItem value="exercise-asc">Exercise (A-Z)</MenuItem>
            <MenuItem value="exercise-desc">Exercise (Z-A)</MenuItem>
            <MenuItem value="calories-desc">Calories (High to Low)</MenuItem>
            <MenuItem value="calories-asc">Calories (Low to High)</MenuItem>
            <MenuItem value="duration-desc">Duration (Long to Short)</MenuItem>
            <MenuItem value="duration-asc">Duration (Short to Long)</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => navigate("/athlete/add-workout")}
          sx={{ px: 1, backgroundColor: theme.palette.primary.main }}
        >
          Log Workout
        </Button>
      </Box>

      {/* Pagination Controls - Top */}
      {filteredWorkouts.length > itemsPerPage && <PaginationControls />}

      {/* Desktop Table */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Exercise</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((workout) => (
                <TableRow key={workout._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                      {moment(workout.date).format("MMM D, YYYY")}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <FitnessCenterIcon fontSize="small" sx={{ mr: 1 }} />
                      {workout.exercise.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                      {workout.duration} min
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <WhatshotIcon fontSize="small" sx={{ mr: 1 }} />
                      {workout.calories} cal
                    </Box>
                  </TableCell>
                  <TableCell>
                    {workout.notes ? (
                      <Typography
                        onClick={() => showFullNote(workout.notes)}
                        sx={{
                          cursor: "pointer",
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {workout.notes}
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                        no notes
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEdit(workout)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(workout._id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile View */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {currentItems.map((workout) => (
          <Paper key={workout._id} sx={{ mb: 2, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body1" fontWeight="medium">
                  {moment(workout.date).format("MMM D, YYYY")}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => handleEdit(workout)} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(workout._id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FitnessCenterIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1">{workout.exercise.name}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{workout.duration} min</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WhatshotIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{workout.calories} cal</Typography>
              </Box>
            </Box>

            {workout.notes && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography
                  onClick={() => showFullNote(workout.notes)}
                  sx={{
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    color: "text.secondary",
                  }}
                >
                  {workout.notes.length > 50
                    ? `${workout.notes.substring(0, 50)}...`
                    : workout.notes}
                </Typography>
              </>
            )}
          </Paper>
        ))}
      </Box>

      {/* Pagination Controls - Bottom */}
      {filteredWorkouts.length > itemsPerPage && <PaginationControls />}

      {filteredWorkouts.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography>No workouts found</Typography>
        </Box>
      )}

      <Dialog
        open={noteDialog.open}
        onClose={() => setNoteDialog({ ...noteDialog, open: false })}
      >
        <DialogTitle>Workout Notes</DialogTitle>
        <DialogContent>
          <Typography>{noteDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog({ ...noteDialog, open: false })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <WorkoutModal
        open={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        onSubmit={handleModalSubmit}
        workout={selectedWorkout}
        mode={selectedWorkout ? "edit" : "add"}
      />
    </Box>
  );
};

export default WorkoutHistory;
