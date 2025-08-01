// description: This code defines a React component for the athlete dashboard, displaying workout statistics, charts, and summaries. It includes features like timeframe selection, exercise breakdown, and performance metrics.
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import Loader from "./../../components/ui/Loader";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { margin, styled } from "@mui/system";
import {
  FitnessCenter,
  Whatshot,
  AccessTime,
  TrendingUp,
  Pool,
  DirectionsBike,
  RunCircle,
  Height as HeightIcon,
  FitnessCenter as FitnessCenterIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Custom Wave Component
const Wave = ({ color = "#3a0ca310" }) => {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "60px",
        opacity: 0.7,
      }}
    >
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        opacity=".25"
        fill={color}
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        opacity=".5"
        fill={color}
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        fill={color}
      />
    </svg>
  );
};

// Custom styled components
const GradientCard = styled(Card)({
  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 40px rgba(31, 38, 135, 0.15)",
  },
});

const TimeframeTabs = styled(Tabs)({
  "& .MuiTab-root": {
    fontWeight: 600,
    textTransform: "capitalize",
    minWidth: "unset",
    padding: "12px 16px",
  },
  "& .Mui-selected": {
    color: "#3a0ca3 !important",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#3a0ca3",
    height: "3px",
  },
});

const COLORS = [
  "#3a0ca3",
  "#4361ee",
  "#4cc9f0",
  "#f72585",
  "#7209b7",
  "#4895ef",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("year");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/athlete/dashboard-stats`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setStats(res.data);
      } catch (err) {
        setError(
          err.response?.data?.errorMessage || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  const handleTimeframeChange = (event, newValue) => {
    setTimeframe(newValue);
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

  if (!stats) return null;

  const currentStats = stats[timeframe];
  const hasData = currentStats.totalDuration > 0;

  // Prepare data for radar chart (top 5 exercises)
  const radarData =
    currentStats.exerciseBreakdown?.slice(0, 5).map((ex) => ({
      subject: ex.name,
      percentage: parseFloat(ex.percentage),
    })) || [];

  // Prepare data for wave chart (timeframe comparison)
  const waveData = Object.entries(stats)
    .filter(([key]) => key !== "all" && stats[key].totalDuration > 0)
    .map(([key, value]) => ({
      timeframe: key.charAt(0).toUpperCase() + key.slice(1),
      calories: value.totalCalories,
      duration: value.totalDuration,
    }));

  // Prepare data for pie chart with proper numeric values
  const pieData =
    currentStats.exerciseBreakdown?.map((ex) => ({
      name: ex.name,
      value: parseFloat(ex.percentage),
    })) || [];

  return (
    <Box sx={{ p: 3, background: "#f8fafc" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 800,
          mb: 3,
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Athlete Dashboard
      </Typography>

      {/* height and width section */}
      <Paper
        sx={{
          mb: 3,
          p: 2,
          borderRadius: "12px",
          bgcolor: "grey.100",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          {["height", "weight"].map((metric) => (
            <Box
              key={metric}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {metric === "height" ? (
                <>
                  <HeightIcon color="primary" />
                  <Typography>
                    {user[metric] ? `${user[metric]} cm` : `_._cm`}
                  </Typography>
                </>
              ) : (
                <>
                  <FitnessCenter color="primary" />
                  <Typography>
                    {user[metric] ? `${user[metric]} kg` : `_._kg`}
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
        <IconButton
          onClick={() => navigate("/auth/profile")}
          color="primary"
          size="small"
        >
          {user.height || user.weight ? <EditIcon /> : <AddIcon />}
        </IconButton>
      </Paper>

      {/* Timeframe Selector */}
      <Paper
        sx={{
          mb: 4,
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.9)",
          position: "sticky",
          top: 0, // Distance from top of viewport
          zIndex: 2, // Ensure it stays above other content
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <TimeframeTabs
          value={timeframe}
          onChange={handleTimeframeChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-scroller": {
              padding: "0 16px", // Add some horizontal padding
            },
          }}
        >
          <Tab label="Today" value="today" />
          <Tab label="Week" value="week" />
          <Tab label="Month" value="month" />
          <Tab label="Year" value="year" />
          <Tab label="All Time" value="all" />
        </TimeframeTabs>
      </Paper>

      {!hasData ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h6" color="textSecondary">
            No workout data available for this time period
          </Typography>
          <Typography variant="body1" mt={2}>
            Start logging your workouts to see your statistics!
          </Typography>
        </Box>
      ) : (
        <>
          {/* Summary Cards with Wave Background */}
          <Grid
            container
            spacing={3}
            sx={{ mb: 4 }}
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent={"center"}
          >
            <Grid item xs={12} md={4}>
              <GradientCard sx={{ position: "relative", overflow: "hidden" }}>
                <Wave color="#3a0ca310" />
                <Box sx={{ position: "relative", zIndex: 1, p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#f7258530", mr: 2 }}>
                      <Whatshot sx={{ color: "#f72585" }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Calories Burned
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {currentStats.totalCalories}
                  </Typography>
                  <Chip
                    label={`${timeframe} total`}
                    size="small"
                    sx={{ bgcolor: "#f7258510", color: "#f72585" }}
                  />
                </Box>
              </GradientCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <GradientCard sx={{ position: "relative", overflow: "hidden" }}>
                <Wave color="#4361ee10" />
                <Box sx={{ position: "relative", zIndex: 1, p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#4361ee30", mr: 2 }}>
                      <AccessTime sx={{ color: "#4361ee" }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Total Duration
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {Math.floor(currentStats.totalDuration / 60)}h{" "}
                    {currentStats.totalDuration % 60}m
                  </Typography>
                  <Chip
                    label={`${timeframe} total`}
                    size="small"
                    sx={{ bgcolor: "#4361ee10", color: "#4361ee" }}
                  />
                </Box>
              </GradientCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <GradientCard sx={{ position: "relative", overflow: "hidden" }}>
                <Wave color="#7209b710" />
                <Box sx={{ position: "relative", zIndex: 1, p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#7209b730", mr: 2 }}>
                      <FitnessCenter sx={{ color: "#7209b7" }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      Top Exercise
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {currentStats.mostTimeSpentExercise.split(" ")[0]}
                  </Typography>
                  <Chip
                    label={`Most ${
                      timeframe === "today" ? "today" : timeframe
                    }`}
                    size="small"
                    sx={{ bgcolor: "#7209b710", color: "#7209b7" }}
                  />
                </Box>
              </GradientCard>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid
            container
            spacing={3}
            flexDirection={{ xs: "column", md: "row" }}
          >
            {/* Exercise Distribution Radar Chart */}
            <Grid item xs={12} md={6} flex={1}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Exercise Performance Radar
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={radarData}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 50]} />
                        <Radar
                          name="Percentage"
                          dataKey="percentage"
                          stroke="#3a0ca3"
                          fill="#3a0ca3"
                          fillOpacity={0.4}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Contribution"]}
                          contentStyle={{ borderRadius: "8px" }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </GradientCard>
            </Grid>

            {/* Top Workout Card */}
            <Grid item xs={12} md={6} flex={1}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Peak Performance Workout
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {currentStats.topCalorieWorkout ? (
                    <>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: "#4cc9f030", mr: 2 }}>
                          <TrendingUp sx={{ color: "#4cc9f0" }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {currentStats.topCalorieWorkout.exercise.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Highest calorie burn
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              bgcolor: "#f8f9fa",
                              p: 2,
                              borderRadius: "8px",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Calories
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {currentStats.topCalorieWorkout.calories}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              bgcolor: "#f8f9fa",
                              p: 2,
                              borderRadius: "8px",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="overline"
                              color="text.secondary"
                            >
                              Duration
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              {currentStats.topCalorieWorkout.duration}m
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(
                              currentStats.topCalorieWorkout.date
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Typography>
                        </Grid>
                        {currentStats.topCalorieWorkout.notes && (
                          <Grid item xs={12}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                bgcolor: "#f8f9fa",
                                borderRadius: "8px",
                              }}
                            >
                              <Typography variant="body2">
                                "{currentStats.topCalorieWorkout.notes}"
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      No workout data
                    </Typography>
                  )}
                </Box>
              </GradientCard>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={3}
            flexDirection={{ xs: "column", md: "row" }}
          >
            {/* Exercise Breakdown Pie Chart - Fixed */}
            <Grid item xs={12} md={6} flex={1}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Exercise Breakdown
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value}%`, `${name}`]}
                          contentStyle={{ borderRadius: "8px" }}
                        />
                        <Legend
                          // verticalAlign="bottom" // Position the legend at the bottom
                          // align="center"       // Center it horizontally
                          wrapperStyle={{
                            paddingTop: "2rem",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </GradientCard>
            </Grid>

            {/* Timeframe Comparison Wave Chart */}
            <Grid item xs={12} md={6} flex={1}>
              <GradientCard>
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Activity Trend
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={waveData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorCalories"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3a0ca3"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3a0ca3"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="timeframe" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ borderRadius: "8px" }}
                          formatter={(value, name) => [
                            name === "calories" ? value : `${value} mins`,
                            name === "calories" ? "Calories" : "Duration",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="calories"
                          stroke="#3a0ca3"
                          fillOpacity={1}
                          fill="url(#colorCalories)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </GradientCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
