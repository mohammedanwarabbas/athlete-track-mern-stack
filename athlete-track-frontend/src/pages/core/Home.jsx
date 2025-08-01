// description: This code defines a React component for the Home page of an athlete tracking application, featuring a hero section, core features, testimonials, and a call-to-action section with animations and responsive design.
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Testimonials from "../../components/common/Testimonials";
import ExerciseScroller from "../../components/common/ExerciseScroller";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import { useNavigate } from "react-router-dom";
import bikeRideImage from "../../assets/images/undraw_bike-ride.svg";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";

const MotionCard = motion(Card);

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else if (user?.role === "athlete") navigate("/athlete/dashboard");
  });

  const coreFeaturesIconStyle = {
    position: "absolute",
    top: "-15%",
    left: "50%",
    border: "1px solid transparent",
    borderRadius: "50%",
    backgroundColor: "white",
    transform: "translateX(-50%)",
    padding: "0.2rem",
    fontSize: { xs: "4rem", md: "5rem" },
    color: theme.palette.primary.dark,
  };

  const coreFeaturesCardStyle = {
    height: "100%",
    borderRadius: 3,
    boxShadow: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    position: "relative",
    overflow: "visible !important",
    p: { xs: "2rem", md: "3rem" },
    bgcolor: theme.palette.grey[200],
    "&:hover": {
      boxShadow: 6,
      transform: "translateY(5px)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
  };
  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="hero-section"
        component={motion.div}
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Box
          component="img"
          src={logo}
          alt="Athlete Track Logo"
          sx={{
            height: { xs: "5rem", md: "8rem" },
            width: "auto",
          }}
        />

        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2rem", md: "5rem", fontWeight: "500" } }}
        >
          Track. Train. Transform.
        </Typography>
        <Typography variant="body1" sx={{fontStyle:'italic'}}>
        For Athletes Who Chase 1% Gains 📈.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, maxWidth: 600 }}>
          Elevate your fitness journey with
          real-time workout analytics and progress tracking.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          sx={{ mt: 4, backgroundColor: theme.palette.primary.dark }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Core Features
        </Typography>

        <Grid sx={{ py: 5 }} container spacing={4} justifyContent="center">
          {[
            {
              icon: (
                <FitnessCenterIcon
                  className="core-features-icon"
                  sx={coreFeaturesIconStyle}
                />
              ),
              title: "Workout Logging",
              desc: "Easily log workouts and track calories burned with just a few taps.",
            },
            {
              icon: (
                <InsertChartIcon
                  className="core-features-icon"
                  sx={coreFeaturesIconStyle}
                />
              ),
              title: "Performance Tracking",
              desc: "Track your performance over time with intelligent stats and visual trends.",
            },
            {
              icon: (
                <TimelineIcon
                  className="core-features-icon"
                  sx={coreFeaturesIconStyle}
                />
              ),
              title: "Advanced Analytics",
              desc: "Get insights like never before with deep analytics and progress charts.",
            },
            {
              icon: (
                <SportsMartialArtsIcon
                  className="core-features-icon"
                  sx={coreFeaturesIconStyle}
                />
              ),
              title: "10+ Exercises",
              desc: "Choose from a variety of predefined exercises tailored to your goals.",
            },
          ].map((feature, idx) => (
            <Grid
              item
              xs={12}
              md={6}
              sx={{ width: { xs: "100%", md: "40%" }, marginTop: 1 }}
            >
              <MotionCard
                className="core-features-card"
                sx={coreFeaturesCardStyle}
                component={motion.div}
                whileInView={{ opacity: [0, 1], y: [50, 0] }}
                transition={{ duration: 1.5 }}
              >
                {feature.icon}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials */}
      <Testimonials />

      {/* Exercise Scroller */}
      <ExerciseScroller />

      <Box sx={{}}>
        {/* Final CTA */}
        <Box
          component={motion.div}
          whileInView={{ opacity: [0, 1], y: [50, 0] }}
          transition={{ duration: 0.8 }}
          sx={{
            position: "relative",
            color: "#fff",
            py: 10,
            px: 2,
            textAlign: "center",
            backgroundColor: "#0d1b2a",
            overflow: "hidden",
          }}
        >
          {/* Floating cycle vector image of cta section */}
          {/* only for pc */}
          <Box
            component={motion.div}
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              bottom: "25%",
              right: "5%",
              width: "15rem",
              height: "10rem",
              backgroundImage: `url(${bikeRideImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              zIndex: 1,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, -20, 0],
              scale: [1, 1.05, 1],
              opacity: [0.8, 0.1, 0.8],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          ></Box>
          {/* text cotnent of cta section */}
          {/* make zindex morethan floating absolute image, make relative, so all its child increase tis zindex too */}
          <Box sx={{ zIndex: 2, position: "relative" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              Your Journey Starts Here
            </Typography>
            <Typography
              variant="h6"
              sx={{ maxWidth: 600, mx: "auto", mb: 4, color: "#cfd8dc" }}
            >
              Join thousands of athletes transforming their performance. Log
              smarter. Train harder. Stay consistent.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "white",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "2rem",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
              onClick={() => navigate("/login")}
            >
              Start Tracking Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
