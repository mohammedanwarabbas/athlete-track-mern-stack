// This code defines a component that displays a horizontally scrolling list of exercise icons with names. used for showcasing available exercises in landing page.
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PoolIcon from "@mui/icons-material/Pool";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import TerrainIcon from "@mui/icons-material/Terrain";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import RowingIcon from "@mui/icons-material/Rowing";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import FestivalIcon from "@mui/icons-material/Festival";

function ExerciseScroller() {
  const theme = useTheme();
  const exerciseScrollerIconStyle = {
    fontSize: 40,
    color: theme.palette.primary.main,
  };
  const exercises = [
    {
      name: "Cycling",
      icon: <DirectionsBikeIcon sx={exerciseScrollerIconStyle} />,
    },
    { name: "Swimming", icon: <PoolIcon sx={exerciseScrollerIconStyle} /> },
    {
      name: "Running",
      icon: <DirectionsRunIcon sx={exerciseScrollerIconStyle} />,
    },
    {
      name: "Weight Lifting",
      icon: <FitnessCenterIcon sx={exerciseScrollerIconStyle} />,
    },
    {
      name: "Yoga",
      icon: <SelfImprovementIcon sx={exerciseScrollerIconStyle} />,
    },
    {
      name: "Boxing",
      icon: <SportsMartialArtsIcon sx={exerciseScrollerIconStyle} />,
    },
    { name: "Hiking", icon: <TerrainIcon sx={exerciseScrollerIconStyle} /> },
    {
      name: "Jump Rope",
      icon: <SportsKabaddiIcon sx={exerciseScrollerIconStyle} />,
    },
    { name: "Rowing", icon: <RowingIcon sx={exerciseScrollerIconStyle} /> },
    {
      name: "Tennis",
      icon: <SportsTennisIcon sx={exerciseScrollerIconStyle} />,
    },
    {
      name: "Stretching",
      icon: <AccessibilityNewIcon sx={exerciseScrollerIconStyle} />,
    },
    { name: "Dancing", icon: <FestivalIcon sx={exerciseScrollerIconStyle} /> },
  ];
  const duplicatedExercises = [...exercises, ...exercises]; // for infinite loop
  return (
    <Box sx={{ py: 8, overflow: "hidden", bgcolor: "#f9f9f9" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Training Activities
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        mb={5}
      >
        Choose from 100+ exercises and stay fit with AthleteTrack
      </Typography>

      <Box
        component={motion.div}
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
        sx={{
          display: "flex",
          whiteSpace: "nowrap",
        }}
      >
        {duplicatedExercises.map((item, index) => (
          <Box
            component={motion.div}
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
            key={index}
            sx={{
              minWidth: { xs: 80, md: 150 },
              mx: 3,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            <Box sx={{ mb: 1 }}>{item.icon}</Box>
            <Typography variant="subtitle1">{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default ExerciseScroller;
