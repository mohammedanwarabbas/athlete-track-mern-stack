// description: This code defines a React component for displaying a custom 404 Not Found page with animations and a button to navigate back to the home page.
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const NotFound = () => {
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
            ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <SentimentVeryDissatisfiedIcon
          sx={{
            fontSize: "6rem",
            color: theme.palette.error.main,
            mb: 2,
          }}
        />
      </motion.div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
            fontWeight: 800,
            mb: 2,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Oops! The page you're looking for doesn't exist.
        </Typography>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
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
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: theme.shadows[4],
            "&:hover": {
              boxShadow: theme.shadows[8],
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Go Back Home
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        style={{ marginTop: "3rem" }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.disabled,
            fontStyle: "italic",
          }}
        >
          "Not all those who wander are lost, but you might be"
        </Typography>
      </motion.div>
    </Box>
  );
};

export default NotFound;
