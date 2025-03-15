import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create a modern, child-friendly theme for Nanny Connect
let theme = createTheme({
  palette: {
    primary: {
      main: '#7E57C2', // Purple main color
      light: '#9575CD',
      dark: '#5E35B1',
      lighter: '#EDE7F6', // Ultra light purple for backgrounds
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3F51B5', // Indigo - complements purple better
      light: '#7986CB',
      dark: '#303F9F',
      lighter: '#E8EAF6',
      contrastText: '#fff',
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#D32F2F',
      lighter: '#FFEBEE',
      contrastText: '#fff',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
      lighter: '#FFF8E1',
      contrastText: '#fff',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
      lighter: '#E1F5FE',
      contrastText: '#fff',
    },
    success: {
      main: '#7C4DFF', // More purplish success color
      light: '#9E7EFF',
      dark: '#5E35B1',
      lighter: '#EDE7F6',
      contrastText: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
      neutral: '#F9FAFB',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    customColors: {
      lightPurple: '#EDE7F6',
      pastelPink: '#FCEAE3',
      softGray: '#F5F7FA',
      softBlue: '#E3F2FD',
    }
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 12px 24px rgba(0, 0, 0, 0.16)',
    ...Array(20).fill('0px 16px 32px rgba(0, 0, 0, 0.2)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.20)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        }
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '0 16px',
          '@media (min-width:600px)': {
            padding: '0 24px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          minWidth: '250px',
          maxWidth: '85vw',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxSizing: 'border-box',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7E57C2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: '#e0e0e0',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#7E57C2',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid #ffffff',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(33, 33, 33, 0.9)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.75rem',
        },
      },
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
