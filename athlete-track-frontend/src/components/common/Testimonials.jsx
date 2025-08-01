// This code defines a testimonials component that displays user feedback with navigation controls and animations.
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Container,
  useTheme,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const testimonials = [
  {
    name: "Aman Sharma",
    quote: "Athlete Track is the best app I’ve ever used to track my workouts!",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Sonia Kennedy",
    quote: "Simple UI and powerful features – love it!",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "David Lee",
    quote:
      "The charts and progress tracking in Athlete Track app keep me motivated.",
    img: "https://randomuser.me/api/portraits/men/30.jpg",
  },
  {
    name: "Avery Torres",
    quote: "Super intuitive and user-friendly!",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "John Doe",
    quote: "Athlete Track Helped me stay consistent with my fitness routine.",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Nisha Mehta",
    quote: "Absolutely love the clean UI and analytics!",
    img: "https://randomuser.me/api/portraits/women/25.jpg",
  },
];

function Testimonials() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // automatic slide change every 5 seconds
  useEffect(() => {
    if (isHovered) return; // Don't auto-advance when hovered

    const interval = setInterval(() => {
      setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]); // Re-run effect when hover state changes

  return (
    <Box sx={{ bgcolor: "#fefefe", py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h4" textAlign="center" gutterBottom>
          What Our Users Say
        </Typography>

        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          component={motion.div}
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            p: 4,
            mt: 4,
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: 3,
            position: "relative",
            textAlign: "center",
          }}
        >
          <Avatar
            src={testimonials[index].img}
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              mb: 2,
            }}
          />
          <Typography variant="subtitle1" gutterBottom>
            {testimonials[index].name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            “{testimonials[index].quote}”
          </Typography>

          {/* Navigation Arrows */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Dot Indicators */}
        <Grid container justifyContent="center" mt={4}>
          {testimonials.map((_, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                width: index === i ? 14 : 10,
                height: index === i ? 14 : 10,
                borderRadius: "50%",
                bgcolor: index === i ? theme.palette.primary.main : "#ccc",
                mx: 0.5,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Testimonials;
