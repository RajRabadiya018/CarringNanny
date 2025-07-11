import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      const userData = await login(email, password);
      console.log('Login successful:', userData);
      
      // Navigate based on user role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'nanny') {
        navigate('/nanny/dashboard');
      } else if (userData.role === 'parent') {
        navigate('/parent/dashboard');
      } else {
        // Fallback or for any other role
        navigate('/');
      }
    } catch (error) {
      // Error will be handled by the AuthContext
      console.error('Login error:', error);
    }
  };

  // Admin login shortcut for testing
  const handleAdminLogin = async () => {
    try {
      setEmail('admin@carringnanny.com');
      setPassword('Admin@12345');
      
      const userData = await login('admin@carringnanny.com', 'Admin@12345');
      console.log('Admin login successful:', userData);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm" 
      sx={{ 
        py: { xs: 3, sm: 6 }, 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isMobile ? 'calc(100vh - 70px)' : 'auto'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          width: '100%',
          overflowY: 'auto',
          maxHeight: isMobile ? 'calc(100vh - 100px)' : 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
            Log In
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome back! Please enter your credentials to continue.
          </Typography>

          {(error || formError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formError || error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>
            
            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ mb: 2, py: 1 }}
              onClick={handleAdminLogin}
              disabled={loading}
            >
              Login as Admin
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" align="center">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="body2">
                    Sign Up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
