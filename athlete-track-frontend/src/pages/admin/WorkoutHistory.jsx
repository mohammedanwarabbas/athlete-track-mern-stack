// description: This code defines a React component for viewing and managing workout history for user:admin, including features like searching, exporting to CSV, and deleting workouts.
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const WorkoutHistory = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteDialog, setNoteDialog] = useState({ open: false, content: "" });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/workouts`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const formattedWorkouts = res.data.data.map((workout) => ({
          ...workout,
          id: workout._id,
          date: workout.date,
          athleteName: workout.athlete?.name || "Unknown",
          athleteEmail: workout.athlete?.email || "",
          exerciseName: workout.exercise?.name || "Unknown",
        }));
        setWorkouts(formattedWorkouts);
      } catch (err) {
        setError(err.response?.data?.errorMessage || "Failed to load workouts");
        toast.error("Failed to load workouts");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [user.token]);

  // Filter workouts
  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.exerciseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.athleteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workout.notes &&
        workout.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Count workouts
  const totalWorkouts = workouts.length;
  const todaysWorkoutsCount = workouts.filter((workout) =>
    moment(workout.date).isSame(moment(), "day")
  ).length;

  // Export to CSV
  const handleExportData = () => {
    const headers = [
      "Date",
      "Athlete",
      "Exercise",
      "Duration (mins)",
      "Calories",
      "Notes",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredWorkouts.map((workout) =>
        [
          `"${moment(workout.date).format("MMM D, YYYY")}"`,
          `"${workout.athleteName}"`,
          `"${workout.exerciseName}"`,
          workout.duration,
          workout.calories,
          `"${workout.notes ? workout.notes.replace(/"/g, '""') : ""}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `workouts_${moment().format("YYYYMMDD")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns configuration
  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => moment(params).format("MMM D, YY"),
    },
    {
      field: "athleteName",
      headerName: "Athlete",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "exerciseName",
      headerName: "Exercise",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "duration",
      headerName: "Mins",
      type: "number",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "calories",
      headerName: "Calories",
      type: "number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "notes",
      headerName: "Notes",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      renderCell: (params) =>
        params.value ? (
          <Box
            onClick={() => setNoteDialog({ open: true, content: params.value })}
            sx={{
              display: "flex",
              alignItems: "center", // Vertical centering
              height: "100%", // Take full cell height
              width: "100%",
            }}
          >
            <Typography
              sx={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                lineHeight: "normal", // Adjust line height if needed
              }}
            >
              {params.value}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center", // Vertical centering
              height: "100%", // Take full cell height
              width: "100%",
              color: "grey",
              fontStyle: "italic",
            }}
          >
            no notes
          </Typography>
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => handleDelete(params.row.id)}
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/workouts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setWorkouts(workouts.filter((w) => w.id !== id));
      toast.success("Workout deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Box
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Workout History
      </Typography>

      <Alert
        severity="info"
        sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}
      >
        Use larger screen to get more confirtable view.
      </Alert>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Typography variant="body1">
          <strong>Total Workouts:</strong> {totalWorkouts}
        </Typography>
        <Typography variant="body1">
          <strong>Today's Workouts:</strong> {todaysWorkoutsCount}
        </Typography>
      </Stack>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2 }}
      >
        <TextField
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: "100%", maxWidth: 400 }}
        />
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportData}
        >
          Export CSV
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ m: 1 }}>
        Click column headers to view sort options!
      </Typography>

      <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <DataGrid
          rows={filteredWorkouts}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          //Render all rows at once if dataset is small to avoid virtualization issues
          disableVirtualization={filteredWorkouts.length < 10}
          // datagrid loader
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          sx={{
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "background.paper",
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "background.default",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              // while hovering over selected row(fix)
              "&:hover": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },
            },
            //apply hover effect only on non-touch devices(hover:hover)
            //in touch devices(hover:none), even after lifting finger, the row remains highlighted
            "@media (hover: hover)": {
              "& .MuiDataGrid-row:hover": {
                // Use active state instead of hover
                cursor: "pointer",
                transition: "background-color 1s",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "& .MuiIconButton-root": {
                  color: "primary.contrastText",
                },
              },
            },
          }}
        />
      </Paper>

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
    </Box>
  );
};

export default WorkoutHistory;
