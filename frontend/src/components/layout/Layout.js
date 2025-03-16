import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import theme from '../../theme';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Responsive navbar height (consistent with AppBar)
  const navbarHeight = isMobile ? 56 : useMediaQuery(theme.breakpoints.up('md')) ? 70 : 64;
    
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
            pt: { 
              xs: `${navbarHeight}px`,  
              sm: `${navbarHeight}px`, 
              md: `${navbarHeight}px` 
            }, // Reduced base padding since it's now handled in each page
            mt: { 
              xs: 2,
              sm: 2,
              md: 2 
            }, // Added consistent margin top
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