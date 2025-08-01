// description: This code defines a loader component that displays a circular progress indicator with custom styling.
import React from "react";
import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Loader() {
  const theme = useTheme();
  return (
    <CircularProgress
      size={60}
      sx={{
        display: "block",
        margin: "20px auto",
        color: theme.palette.primary.main,
        fontSize: "2rem",
      }}
    />
  );
}