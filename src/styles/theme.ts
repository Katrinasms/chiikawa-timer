import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '1rem',
          marginTop: '10px',
          
        }
      },
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default theme;