import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import theme from '../../theme';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const mainContentRef = useRef(null);
  
  // Responsive navbar height (consistent with AppBar)
  const navbarHeight = isMobile ? 56 : isMd ? 70 : 64;
  
  // Scroll to top when route changes - with multiple approaches for reliability
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Also try to scroll the main content area
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    
    // Add a slight delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      
      // Focus on main content for accessibility and to help with scroll position
      if (mainContentRef.current) {
        mainContentRef.current.focus();
      }
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
    
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
          ref={mainContentRef}
          tabIndex={-1}
          sx={{
            flexGrow: 1,
            width: '100%',
            pt: { 
              xs: `${navbarHeight}px`,  
              sm: `${navbarHeight}px`, 
              md: `${navbarHeight}px` 
            },
            mt: { 
              xs: 2,
              sm: 2,
              md: 2 
            },
            pb: { xs: 4, sm: 6 },
            overflow: 'visible',
            position: 'relative',
            zIndex: 1,
            outline: 'none' // Remove focus outline but maintain focus ability
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