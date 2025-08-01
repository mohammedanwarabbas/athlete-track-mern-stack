// This code defines a footer component for the AthleteTrack application, including social media links and branding.
import React from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1c1c1c",
        color: "#fff",
        pt: 8,
        pb: 4,
        mt: 10,
      }}
    >
      <Container>
        <Grid container spacing={4} justifyContent={"space-between"}>
          {/* Brand + Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              𐤠thlete tr𐤠ck
            </Typography>
            <Typography variant="body2" color="gray">
              For Athletes Who Chase 1% Gains📈. Your one-stop platform to log
              workouts, analyze performance, and stay fit. Train smart. Live
              stronger.
            </Typography>
          </Grid>

          {/* social icons */}
          <Grid item xs={12} md={4}>
            <Box>
              {[
                {
                  Icon: Facebook,
                  url: "https://www.facebook.com/facebook",
                  name: "Facebook",
                },
                {
                  Icon: Twitter,
                  url: "https://twitter.com/Twitter",
                  name: "Twitter",
                },
                {
                  Icon: Instagram,
                  url: "https://www.instagram.com/instagram",
                  name: "Instagram",
                },
                {
                  Icon: LinkedIn,
                  url: "https://www.linkedin.com/company/linkedin",
                  name: "LinkedIn",
                },
              ].map(({ Icon, url, name }, i) => (
                <IconButton
                  key={i}
                  component={motion.a}
                  whileHover={{ scale: 1.2 }}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#fff",
                    mr: 1,
                    "&:hover": {
                      color: (theme) => theme.palette.primary.main,
                    },
                  }}
                  aria-label={`${name} official page`} // Fixed here
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Text */}
        <Box textAlign="center" mt={6} borderTop="1px solid #333" pt={3}>
          <Typography variant="body2" color="gray">
            © {new Date().getFullYear()} AthleteTrack. All rights reserved.
            Developed by Anwar.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
