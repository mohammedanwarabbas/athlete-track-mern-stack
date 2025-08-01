import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./assets/styles/theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);
