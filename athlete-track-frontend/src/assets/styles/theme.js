import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',    // Vibrant blue (actions)
      light: '#93C5FD',   // Soft blue (hover states)
      dark: '#1D4ED8',    // Deep blue (navbar/footer)
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#64748B',    // Neutral slate (secondary UI)
      light: '#E2E8F0',   // Light gray (backgrounds)
      dark: '#475569',    // Dark slate (text accents)
      contrastText: '#FFFFFF'
    },
    textPrimary: {
      main: '#ffffff', // Default text color
    },
    textSecondary: {
      main: '#000000', // Default secondary text color
    },
    background: {
      default: '#f5f5f5', // Default background color
      paper: '#ffffff', // Default paper background color
    },
  },
  typography: {
    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Example font
    h1: {
      // fontSize: '2.5rem',
      // fontWeight: 500,
    },
    // ... other typography settings
  },
  // ... other theme customizations (spacing, breakpoints, etc.)
});

export default theme;
