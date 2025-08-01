// description: This code defines a responsive navigation bar for the AthleteTrack application, including user authentication and role-based menu items. also highlights the active link based on the current route.
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useTheme } from "@mui/material/styles";

const getDesktopNavigationButtonStyle = (isActive, theme) => {
  return {
    textAlign: "center",
    my: 2,
    color: theme.palette.primary.contrastText,
    display: "block",
    border: isActive
      ? `1px solid ${theme.palette.primary.contrastText}`
      : "none",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  };
};

const getMobileNavigationButtonStyle = (isActive, theme) => {
  return {
    backgroundColor: isActive ? theme.palette.primary.light : "transparent",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  };
};

function Navbar() {
  //activate navbar link
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => {
    if (path === "/") return currentPath === path;
    return currentPath.startsWith(path);
  };

  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Public menu items (visible to all)
  let publicPages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  // if user logged in, remove home page
  if (user) {
    publicPages = publicPages.filter((page) => page.path !== "/");
  }
  // if user not logged in add login and register menus
  if (!user) {
    publicPages = publicPages.concat([
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
    ]);
  }

  // Athlete-only menu items
  const athletePages = [
    { name: "Dashboard", path: "/athlete/dashboard" },
    { name: "Workout History", path: "/athlete/workout-history" },
    { name: "Log Workout", path: "/athlete/add-workout" },
  ];

  // Admin-only menu items
  const adminPages = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Workout History", path: "/admin/workout-history" },
    { name: "Athlete List", path: "/admin/athlete-list" },
    { name: "Exercise List", path: "/admin/exercise-list" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseUserMenu();
  };

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: theme.palette.primary.dark }}
    >
      <Container maxWidth="xl" sx={{ px: "0.5rem" }}>
        {/* main navbar */}
        <Toolbar disableGutters>
          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                padding: 0,
                backgroundColor: theme.palette.primary.dark,
                borderRadius: "25%",
              }}
            >
              <MenuIcon sx={{ fontSize: "2.8rem" }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {/* Public links */}
              {publicPages.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={getMobileNavigationButtonStyle(
                    isActive(page.path),
                    theme
                  )}
                >
                  <Typography>{page.name}</Typography>
                </MenuItem>
              ))}

              {/* Athlete links */}
              {user?.role === "athlete" &&
                athletePages.map((page) => (
                  <MenuItem
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                    sx={getMobileNavigationButtonStyle(
                      isActive(page.path),
                      theme
                    )}
                  >
                    <Typography>{page.name}</Typography>
                  </MenuItem>
                ))}

              {/* Admin links */}
              {user?.role === "admin" &&
                adminPages.map((page) => (
                  <MenuItem
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                    sx={getMobileNavigationButtonStyle(
                      isActive(page.path),
                      theme
                    )}
                  >
                    <Typography>{page.name}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: "none",
              fontSize: { xs: "1.4rem", md: "1.8rem" },
              transition: "all 0.3s ease-in-out",
              backgroundColor: theme.palette.primary.contrastText,
              padding: "0.4rem 0.4rem",
              borderRadius: "0.5rem",
              marginRight: "0.4rem",
              "&:hover": {
                letterSpacing: { sx: 0, md: "0.1rem" },
                color: theme.palette.secondary.main,
              },
            }}
          >
            𐤠thlete tr𐤠ck
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {/* Public links */}
            {publicPages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={getDesktopNavigationButtonStyle(isActive(page.path), theme)}
              >
                {page.name}
              </Button>
            ))}

            {/* Conditional links */}
            {user?.role === "athlete" &&
              athletePages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  sx={getDesktopNavigationButtonStyle(
                    isActive(page.path),
                    theme
                  )}
                >
                  {page.name}
                </Button>
              ))}

            {user?.role === "admin" &&
              adminPages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  sx={getDesktopNavigationButtonStyle(
                    isActive(page.path),
                    theme
                  )}
                >
                  {page.name}
                </Button>
              ))}
          </Box>

          {/* User Avatar (conditional) */}
          {user && (
            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <Tooltip title="User menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      width: { xs: "2.6rem", md: "3.4rem" },
                      height: { xs: "2.6rem", md: "3.4rem" },
                      bgcolor: theme.palette.secondary.main,
                    }}
                    alt={user.name}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=eee&color=000`}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "1rem" }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* User Info Header */}
                <MenuItem
                  disabled
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.5,
                    opacity: 1, // Override disabled opacity
                    "&:hover": { background: "transparent" }, // Disable hover effect
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.name.split(" ")[0]}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {user.role === "admin" ? (
                      <AdminPanelSettingsIcon
                        sx={{ fontSize: "1rem", mr: 0.5 }}
                      />
                    ) : (
                      <PersonOutlineIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                    )}
                    {user.role}
                  </Typography>
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                {/* Menu Items */}
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate("/auth/profile");
                  }}
                >
                  <Typography>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;