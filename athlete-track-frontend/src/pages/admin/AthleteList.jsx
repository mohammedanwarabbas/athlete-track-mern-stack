// description: This code defines a React component for managing and displaying a list of athletes in an admin dashboard. It includes features like searching, pagination, and exporting athlete data to CSV format.
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
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const AthleteList = () => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/athletes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const formattedAthletes = res.data.map((athlete, index) => ({
          ...athlete,
          id: athlete._id,
          slNo: index + 1,
          joinedAt: moment(athlete.createdAt).format("MMM D, YYYY h:mm A"),
        }));
        setAthletes(formattedAthletes);
      } catch (err) {
        toast.error(
          err.response?.data?.errorMessage || "Failed to load athletes"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
  }, [user.token]);

  // Filter athletes
  const filteredAthletes = athletes.filter(
    (athlete) =>
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count athletes
  const totalAthletes = athletes.length;
  const todaysAthletesCount = athletes.filter((athlete) =>
    moment(athlete.createdAt).isSame(moment(), "day")
  ).length;

  // Export to CSV
  const handleExportData = () => {
    const headers = ["SL No", "Name", "Email", "Joined At"];

    const csvRows = [
      headers.join(","),
      ...filteredAthletes.map((athlete) =>
        [
          athlete.slNo,
          `"${athlete.name}"`,
          `"${athlete.email}"`,
          athlete.joinedAt,
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
      `athletes_${moment().format("YYYYMMDD")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns configuration
  const columns = [
    {
      field: "slNo",
      headerName: "SL No",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Athlete Management
      </Typography>

      <Alert
        severity="info"
        sx={{ display: { xs: "flex", md: "none" }, mb: 1 }}
      >
        Use larger screen to get more confirtable view.
      </Alert>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Typography variant="body1">
          <strong>Total Athletes:</strong> {totalAthletes}
        </Typography>
        <Typography variant="body1">
          <strong>Joined Today:</strong> {todaysAthletesCount}
        </Typography>
      </Stack>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2 }}
      >
        <TextField
          placeholder="Search athletes..."
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

      <Paper sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <DataGrid
          rows={filteredAthletes}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          //Render all rows at once if dataset is small to avoid virtualization issues
          disableVirtualization={filteredAthletes.length < 10}
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
    </Box>
  );
};

export default AthleteList;
