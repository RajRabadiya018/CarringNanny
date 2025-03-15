import BusinessIcon from '@mui/icons-material/Business';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
    Box,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../common/Logo';

const Footer = () => {
  const theme = useTheme();
  
  const handlePolicyClick = (policyName) => (e) => {
    e.preventDefault();
    alert(`${policyName} will be available soon.`);
  };
  
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Logo size="medium" sx={{ mr: 1, filter: 'brightness(1.2)' }} />
              <Typography variant="h5" component="div" fontWeight="bold">
                CarringNanny
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Connecting parents with professional nannies for quality childcare services.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/nannies" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Find Nannies
            </Link>
            <Link component={RouterLink} to="/register" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Register
            </Link>
            <Link component={RouterLink} to="/login" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Login
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: rajrabadiya.018@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +1 (555) 123-4567
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" fontWeight="medium">
                Owner: Raj Rabadiya
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            © {new Date().getFullYear()} CarringNanny. All rights reserved.
          </Typography>
          <Box>
            <Link 
              component="a" 
              href="#" 
              onClick={handlePolicyClick('Privacy Policy')} 
              color="inherit" 
              sx={{ mr: 2 }}
            >
              Privacy Policy
            </Link>
            <Link 
              component="a" 
              href="#" 
              onClick={handlePolicyClick('Terms of Service')} 
              color="inherit" 
              sx={{ mr: 2 }}
            >
              Terms of Service
            </Link>
            <Link 
              component="a" 
              href="#" 
              onClick={handlePolicyClick('Cookies Policy')} 
              color="inherit"
            >
              Cookies Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
