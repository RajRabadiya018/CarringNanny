import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import theme from '../../theme';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Standard navbar height
  const navbarHeight = 70;
    
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          maxWidth: '100vw',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            pt: `${navbarHeight + 16}px`, // Add extra padding to prevent content from being hidden under navbar
            pb: { xs: 4, sm: 6 },
            overflow: 'visible',
            position: 'relative',
            zIndex: 1
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 