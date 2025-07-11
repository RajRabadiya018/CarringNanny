import BusinessIcon from '@mui/icons-material/Business';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Container, Divider, Grid, IconButton, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../common/Logo';

const Footer = () => {
  const handlePolicyClick = (policyName) => (e) => {
    e.preventDefault();
    alert(`${policyName} will be available soon.`);
  };

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: { xs: 4, sm: 6 },
        mt: 'auto',
        width: '100%',
        position: 'relative',
        zIndex: 0,
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Logo
                size="medium"
                sx={{
                  mr: 1,
                  filter: 'brightness(1.2)',
                  color: '#fff',
                }}
                withText
              />
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

          <Grid item xs={6} sm={4}>
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

          <Grid item xs={6} sm={4}>
            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: rajrabadiya.018@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +91 1234567890
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'left' } }}>
            © {new Date().getFullYear()} CarringNanny. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              component="a"
              href="#"
              onClick={handlePolicyClick('Privacy Policy')}
              color="inherit"
              sx={{ mx: 1, mb: { xs: 1, sm: 0 } }}
            >
              Privacy Policy
            </Link>
            <Link
              component="a"
              href="#"
              onClick={handlePolicyClick('Terms of Service')}
              color="inherit"
              sx={{ mx: 1, mb: { xs: 1, sm: 0 } }}
            >
              Terms of Service
            </Link>
            <Link
              component="a"
              href="#"
              onClick={handlePolicyClick('Cookies Policy')}
              color="inherit"
              sx={{ mx: 1 }}
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
