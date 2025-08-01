// description: This code defines a React component for the About page of an athlete tracking application, showcasing the technology stack and project structure using a tree view and styled components.
import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  useTheme,
  Chip,
} from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { FaFolderPlus, FaFolderMinus } from "react-icons/fa6";
import {
  Code as CodeIcon,
  InsertDriveFile,
  Lock,
  VpnKey,
  Dns,
  Security,
  DataArray,
  // Core
  Build, // Vite
  Settings, // React
  // UI
  Brush, // MUI
  Palette, // Ant Design
  // Routing
  Route, // React Router
  // API
  Cloud, // Axios
  // Forms
  Description, // Formik
  TaskAlt, // Yup
  // Charts
  BarChart,
  // Animations
  Animation,
  // Dates
  Event,
  // Notifications
  Notifications,
  // Icons
  Image,
  // Tables
  TableChart,
  // Carousels
  Slideshow,
  // State
  Storage,
  // Cookies
  Cookie,
  // Linting
  VerifiedUser,
} from "@mui/icons-material";
import logo from "../../assets/images/logo.png";

const About = () => {
  const theme = useTheme();

  // Tech stack data
  const techStacks = {
    "Frontend Core": [
      { name: "Framework", tech: "React 19", icon: <Settings /> },
      { name: "Build Tool", tech: "Vite 7", icon: <Build /> },
    ],
    "UI & Design": [
      {
        name: "Component Libraries",
        tech: "MUI 7 + Ant Design 5",
        icon: <Brush />,
      },
      {
        name: "Icons",
        tech: "MUI Icons + React Icons + Lucide + Feather",
        icon: <Image />,
      },
    ],
    "Data Management": [
      { name: "Routing", tech: "React Router 7", icon: <Route /> },
      { name: "HTTP Client", tech: "Axios 1.10", icon: <Cloud /> },
      { name: "Forms", tech: "Formik 2 + Yup", icon: <Description /> },
      { name: "State", tech: "React Context", icon: <Storage /> },
    ],
    Visualization: [
      { name: "Charts", tech: "Recharts 3.1", icon: <BarChart /> },
      { name: "Tables", tech: "MUI X Data Grid 8", icon: <TableChart /> },
      { name: "Carousels", tech: "react-slick 0.3", icon: <Slideshow /> },
    ],
    Utilities: [
      { name: "Animations", tech: "Framer Motion 12", icon: <Animation /> },
      { name: "Dates", tech: "date-fns 4 + Moment 2", icon: <Event /> },
      {
        name: "Notifications",
        tech: "react-toastify 11",
        icon: <Notifications />,
      },
      { name: "Cookies", tech: "js-cookie 3", icon: <Cookie /> },
      { name: "Linting", tech: "ESLint 9", icon: <VerifiedUser /> },
    ],
    Backend: [
      { name: "Runtime", tech: "Node.js", icon: <DataArray /> },
      { name: "Framework", tech: "Express 5", icon: <Dns /> },
      { name: "Database", tech: "MongoDB (Mongoose 8)", icon: <Storage /> },
      { name: "Authentication", tech: "JWT + bcryptjs", icon: <VpnKey /> },
      { name: "Validation", tech: "validator 13", icon: <Security /> },
      { name: "Environment", tech: "dotenv", icon: <Cloud /> },
      { name: "Security", tech: "cors", icon: <Lock /> },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Logo & Title Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          component="img"
          src={logo}
          alt="Athlete Track Logo"
          sx={{
            height: { xs: "4rem", md: "6rem" },
            width: "auto",
          }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mt: { xs: 0, md: 2 },
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          𐤠thlete tr𐤠ck
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 1,
            color: theme.palette.secondary.dark,
            fontStyle: "italic",
            fontSize: "1.2rem",
          }}
        >
          For Athletes Who Chase 1% Gains
        </Typography>
      </Box>

      {/* about developer */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            bgcolor: theme.palette.grey[100],
            borderLeft: `3px solid ${theme.palette.primary.main}`,
          }}
        >
          <CodeIcon
            sx={{
              fontSize: "2rem",
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Developed by:{" "}
            <Box component="span" sx={{ color: theme.palette.primary.dark }}>
              Mohammed Anwar
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Two Column Layout */}
      <Grid
        container
        spacing={3}
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent={"center"}
      >
        {/* Left Column - Tech Stack */}
        <Grid item xs={12} md={6} flex={1}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Technology Stack
          </Typography>

          <Box display={"flex"} flexDirection="column" gap={2}>
            {Object.entries(techStacks).map(([stack, items]) => (
              <Box key={stack}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      color: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={stack}
                      size="large"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary.contrastText,
                      }}
                    />
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: theme.palette.grey[100],
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            bgcolor: theme.palette.primary.main,
                            borderRadius: "50%",
                            display: "flex",
                            color: theme.palette.primary.contrastText,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.tech}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right Column - Project Structure */}
        <Grid item xs={12} md={6} flex={1}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Project Structure
          </Typography>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: theme.palette.grey[200],
            }}
          >
            <SimpleTreeView
              defaultExpandedItems={["root", "backend", "config", "frontend"]}
              slots={{
                expandIcon: FaFolderPlus, // Expanded folder icon
                collapseIcon: FaFolderMinus, // Collapsed folder icon
                endIcon: InsertDriveFile,
              }}
              sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            >
              {/* Root */}
              <TreeItem itemId="root" label="athlete-track/">
                {/* Backend */}
                <TreeItem itemId="backend" label="athlete-track-backend">
                  <TreeItem itemId="config" label="config/">
                    <TreeItem itemId="db" label="db.js" />
                  </TreeItem>
                  <TreeItem itemId="controllers" label="controllers/">
                    <TreeItem
                      itemId="adminController"
                      label="adminController.js"
                    />
                    <TreeItem
                      itemId="athleteController"
                      label="athleteController.js"
                    />
                    <TreeItem
                      itemId="authController"
                      label="authController.js"
                    />
                  </TreeItem>
                  <TreeItem itemId="middlewares" label="middlewares/">
                    <TreeItem
                      itemId="authMiddleware"
                      label="authMiddleware.js"
                    />
                  </TreeItem>
                  <TreeItem itemId="models" label="models/">
                    <TreeItem itemId="Exercise" label="Exercise.js" />
                    <TreeItem itemId="User" label="User.js" />
                    <TreeItem itemId="Workout" label="Workout.js" />
                  </TreeItem>
                  <TreeItem itemId="routes" label="routes/">
                    <TreeItem itemId="adminRoutes" label="adminRoutes.js" />
                    <TreeItem itemId="athleteRoutes" label="athleteRoutes.js" />
                    <TreeItem itemId="authRoutes" label="authRoutes.js" />
                  </TreeItem>
                  <TreeItem itemId="scripts" label="scripts/">
                    <TreeItem itemId="seedAdmin" label="seedAdmin.js" />
                    <TreeItem itemId="seedExercise" label="seedExercise.js" />
                    <TreeItem itemId="seedWorkouts" label="seedWorkouts.js" />
                  </TreeItem>
                  <TreeItem itemId="package" label="package.json" />
                  <TreeItem itemId="packageLock" label="package-lock.json" />
                  <TreeItem itemId="server" label="server.js" />
                </TreeItem>

                {/* Frontend */}
                <TreeItem itemId="frontend" label="athlete-track-frontend">
                  <TreeItem itemId="public" label="public/">
                    <TreeItem itemId="logo" label="logo.png" />
                  </TreeItem>
                  <TreeItem itemId="src" label="src/">
                    <TreeItem itemId="assets" label="assets/">
                      <TreeItem itemId="fonts" label="fonts/" />
                      <TreeItem itemId="images" label="images/">
                        <TreeItem
                          itemId="exercisingMan2"
                          label="exercising-man-2.jpg"
                        />
                        <TreeItem
                          itemId="exercisingMan"
                          label="exercising-man.jpg"
                        />
                      </TreeItem>
                      <TreeItem itemId="styles" label="styles/">
                        <TreeItem itemId="globalCSS" label="global.css" />
                        <TreeItem itemId="themeJS" label="theme.js" />
                      </TreeItem>
                    </TreeItem>
                    <TreeItem itemId="components" label="components/">
                      <TreeItem itemId="auth" label="auth/">
                        <TreeItem
                          itemId="protectedRoute"
                          label="ProtectedRoute.jsx"
                        />
                      </TreeItem>
                      <TreeItem itemId="components-common" label="common/">
                        <TreeItem
                          itemId="exerciseModal"
                          label="ExerciseModal.jsx"
                        />
                        <TreeItem
                          itemId="exerciseScroller"
                          label="ExerciseScroller.jsx"
                        />
                        <TreeItem
                          itemId="testimonials"
                          label="Testimonials.jsx"
                        />
                        <TreeItem
                          itemId="workoutModal"
                          label="WorkoutModal.jsx"
                        />
                      </TreeItem>
                      <TreeItem itemId="layout" label="layout/">
                        <TreeItem itemId="footer" label="Footer.jsx" />
                        <TreeItem itemId="navbar" label="Navbar.jsx" />
                      </TreeItem>
                      <TreeItem itemId="ui" label="ui/">
                        <TreeItem itemId="loader" label="Loader.jsx" />
                      </TreeItem>
                    </TreeItem>
                    <TreeItem itemId="context" label="context/">
                      <TreeItem itemId="authContext" label="AuthContext.jsx" />
                    </TreeItem>
                    <TreeItem itemId="pages" label="pages/">
                      <TreeItem itemId="admin" label="admin/">
                        <TreeItem
                          itemId="athleteList"
                          label="AthleteList.jsx"
                        />
                        <TreeItem itemId="admin-dashboard" label="Dashboard.jsx" />
                        <TreeItem
                          itemId="exerciseList"
                          label="ExerciseList.jsx"
                        />
                        <TreeItem
                          itemId="admin-workoutHistory"
                          label="WorkoutHistory.jsx"
                        />
                      </TreeItem>
                      <TreeItem itemId="athlete" label="athlete/">
                        <TreeItem itemId="addWorkout" label="AddWorkout.jsx" />
                        <TreeItem itemId="athlete-dashboard" label="Dashboard.jsx" />
                        <TreeItem
                          itemId="athlete-workoutHistory"
                          label="WorkoutHistory.jsx"
                        />
                      </TreeItem>
                      <TreeItem itemId="pages-auth" label="auth/">
                        <TreeItem itemId="login" label="Login.jsx" />
                        <TreeItem itemId="register" label="Register.jsx" />
                        <TreeItem
                          itemId="updateProfile"
                          label="UpdateProfile.jsx"
                        />
                      </TreeItem>
                      <TreeItem itemId="pages-common" label="common/">
                        <TreeItem itemId="notFound" label="NotFound.jsx" />
                        <TreeItem
                          itemId="unauthorized"
                          label="Unauthorized.jsx"
                        />
                      </TreeItem>
                      <TreeItem itemId="core" label="core/">
                        <TreeItem itemId="about" label="About.jsx" />
                        <TreeItem itemId="home" label="Home.jsx" />
                      </TreeItem>
                    </TreeItem>
                    <TreeItem itemId="appCSS" label="App.css" />
                    <TreeItem itemId="appJSX" label="App.jsx" />
                    <TreeItem itemId="configJS" label="config.js" />
                    <TreeItem itemId="indexCSS" label="index.css" />
                    <TreeItem itemId="mainJSX" label="main.jsx" />
                  </TreeItem>
                  <TreeItem itemId="eslint" label="eslint.config.js" />
                  <TreeItem itemId="indexHTML" label="index.html" />
                  <TreeItem itemId="packageFrontend" label="package.json" />
                  <TreeItem
                    itemId="packageLockFrontend"
                    label="package-lock.json"
                  />
                  <TreeItem itemId="viteConfig" label="vite.config.js" />
                </TreeItem>
                {/* <TreeItem itemId="git" label=".git" />
                <TreeItem itemId="gitignore" label=".gitignore" /> */}
                <TreeItem itemId="readme" label="README.md" />
              </TreeItem>
            </SimpleTreeView>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
