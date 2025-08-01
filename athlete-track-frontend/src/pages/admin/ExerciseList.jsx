// description: This code defines a React component for managing exercises for user:admin, including features like adding, editing, deleting, restoring exercises, and exporting exercise data to CSV.
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  RestoreFromTrash as RestoreIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import ExerciseModal from "../../components/common/ExerciseModal";

const ExercisesList = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  // Count exercises
  const totalExercises = exercises.length;
  const activeExercisesCount = exercises.filter((e) => !e.isDeleted).length;

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/exercises`, {
          params: { showDeleted },
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Keep the original data without number conversion
        setExercises(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error(
          err.response?.data?.errorMessage || "Failed to load exercises"
        );
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [user.token, showDeleted]);

  // Filter exercises with null checks
  const filteredExercises = exercises
    .filter((exercise) => exercise && exercise.name)
    .filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Export to CSV
  const handleExportData = () => {
    const headers = ["Name", "Calories Per Minute", "Status"];

    const csvRows = [
      headers.join(","),
      ...filteredExercises.map((exercise) =>
        [
          `"${exercise.name}"`,
          exercise.caloriesPerMin,
          exercise.isDeleted ? "Deleted" : "Active",
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
      `exercises_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/exercises/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Exercise deleted successfully");
      refreshExercises();
    } catch (err) {
      toast.error(
        err.response?.data?.errorMessage || "Failed to delete exercise"
      );
    }
  };

  // Handle restore
  const handleRestore = async (id) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/exercises/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      toast.success("Exercise restored successfully");
      refreshExercises();
    } catch (err) {
      toast.error(
        err.response?.data?.errorMessage || "Failed to restore exercise"
      );
    }
  };

  // Refresh exercises list
  const refreshExercises = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/admin/exercises`, {
        params: { showDeleted },
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        // Keep the original data without number conversion
        setExercises(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => toast.error("Failed to refresh exercises"))
      .finally(() => setLoading(false));
  };

  // Safe value getter for status column
  const getExerciseStatus = (value, row) => {
    return row.isDeleted ? "Deleted" : "Active";
  };

  // Columns configuration
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "caloriesPerMin",
      headerName: "Calories/Min",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        // params.value is udnefined but parms worked here
        // Handle cases where value might be undefined or null
        if (params === undefined || params === null) return "0.0";
        // Format the number with one decimal place
        return typeof params === "number"
          ? params.toFixed(1)
          : Number(params).toFixed(1);
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: getExerciseStatus,
      //   renderCell: (params) => (
      //     <Typography
      //       variant="body2"
      //       color={params.row.isDeleted ? 'error.main' : 'success.main'}
      //       sx={{ fontWeight: 'bold' }}
      //     >
      //       {params.row.isDeleted ? 'Deleted' : 'Active'}
      //     </Typography>
      //   )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          {params?.row && !params.row.isDeleted ? (
            <>
              <Tooltip title="Edit exercise">
                <IconButton
                  size="small"
                  onClick={() => {
                    setCurrentExercise(params.row);
                    setModalOpen(true);
                  }}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete exercise">
                <IconButton
                  size="small"
                  onClick={() =>
                    setConfirmDialog({
                      open: true,
                      title: "Delete Exercise",
                      message: `Are you sure you want to delete "${params.row.name}"?`,
                      action: () => handleDelete(params.row._id),
                    })
                  }
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Restore exercise">
              <IconButton
                size="small"
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    title: "Restore Exercise",
                    message: `Restore "${
                      params?.row?.name || "this exercise"
                    }"?`,
                    action: () => handleRestore(params.row._id),
                  })
                }
                color="primary"
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Error state */}
      {!loading && exercises.length === 0 && (
        <Typography color="error">No exercises found</Typography>
      )}

      <>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Exercise Management
        </Typography>

        <Alert
          severity="info"
          sx={{ display: { xs: "flex", md: "none" }, mb: 1 }}
        >
          Use larger screen to get more confirtable view.
        </Alert>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography>
            Now restore deleted exercise using{" "}
            <RestoreIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
            icon.
          </Typography>
        </Alert>

        {/* Statistics and controls */}
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>Total Exercises:</strong> {totalExercises}
          </Typography>
          <Typography variant="body1">
            <strong>Active Exercises:</strong> {activeExercisesCount}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? "Hide Deleted" : "Show Deleted"}
          </Button>
        </Stack>

        {/* Search and action buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search exercises..."
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportData}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentExercise(null);
                setModalOpen(true);
              }}
            >
              Add Exercise
            </Button>
          </Box>
        </Box>

        {/* DataGrid */}
        <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={filteredExercises}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            //Render all rows at once if dataset is small to avoid virtualization issues
            disableVirtualization={filteredExercises.length < 10}
            // datagrid loader
            slotProps={{
              loadingOverlay: {
                variant: "linear-progress",
                noRowsVariant: "linear-progress",
              },
            }}
            getRowId={(row) => row._id}
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
                "& .MuiIconButton-root": {
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
      </>

      {/* Exercise Modal */}
      <ExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refreshExercises();
          setModalOpen(false);
        }}
        exercise={currentExercise}
        mode={currentExercise ? "edit" : "add"}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDialog.action();
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExercisesList;
