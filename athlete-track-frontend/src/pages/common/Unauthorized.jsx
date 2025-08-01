// description: This code defines a React component for displaying an Unauthorized access page with animations, icons, and buttons to navigate back to the homepage or sign in again.
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

const Unauthorized = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 3,
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at center, #1a1a1a 0%, #121212 100%)"
            : "radial-gradient(circle at center, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Box sx={{ position: "relative", mb: 4 }}>
          <LockOutlinedIcon
            sx={{
              fontSize: "8rem",
              color: theme.palette.error.main,
              opacity: 0.8,
            }}
          />
          <SecurityOutlinedIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "4rem",
              color: theme.palette.warning.main,
            }}
          />
        </Box>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
          }}
        >
          Access Denied
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          You don't have permission to access this page. Please contact your
          administrator or return to a safe page.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: theme.shadows[4],
              }}
            >
              Go to Homepage
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": { borderWidth: 2 },
              }}
            >
              Sign In Again
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ marginTop: "3rem" }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: theme.palette.text.disabled,
            fontStyle: "italic",
          }}
        >
          Error code: 403 Forbidden
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Unauthorized;
