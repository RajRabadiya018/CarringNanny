import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Link,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TermsAndConditions from '../components/layout/TermsAndConditions';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [formError, setFormError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setTermsError('');

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    // Check Terms and Conditions acceptance for nannies
    if (role === 'nanny' && !termsAccepted) {
      setTermsError('You must accept the Terms & Conditions to register as a Nanny');
      return;
    }

    try {
      await register(name, email, password, role);
      if (role === 'nanny') {
        navigate('/nanny/profile/setup'); // Redirect to profile setup for nannies
      } else {
        navigate('/'); // Redirect to home for parents/admins
      }
    } catch (error) {
      // Error will be handled by the AuthContext
      console.error('Registration error:', error);
    }
  };

  const handleOpenTerms = () => {
    setTermsDialogOpen(true);
  };

  const handleCloseTerms = () => {
    setTermsDialogOpen(false);
    setTermsAccepted(true);
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
            <PersonAddIcon />
          </Box>
          <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join CarringNanny to find the perfect childcare solution for your family.
          </Typography>

          {(error || formError) && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formError || error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  helperText="Password must be at least 6 characters"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">I am a:</FormLabel>
                  <RadioGroup
                    row
                    aria-label="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <FormControlLabel value="parent" control={<Radio />} label="Parent" />
                    <FormControlLabel value="nanny" control={<Radio />} label="Nanny" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              {role === 'nanny' && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'primary.lighter', 
                    borderRadius: 1, 
                    border: termsError ? '1px solid #f44336' : 'none'
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          name="termsAccepted"
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          I accept the{' '}
                          <Link
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={handleOpenTerms}
                            sx={{ fontWeight: 'bold' }}
                          >
                            Terms & Conditions
                          </Link>{' '}
                          for Nannies, including child safety regulations and legal requirements
                        </Typography>
                      }
                    />
                    {termsError && (
                      <FormHelperText error>{termsError}</FormHelperText>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      *As a childcare provider, you are required to comply with all applicable laws and regulations, including the Protection of Children from Sexual Offences Act (POCSO), 2012, and Juvenile Justice Act, 2015.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" align="center">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Log In
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      <TermsAndConditions open={termsDialogOpen} onClose={handleCloseTerms} />
    </Container>
  );
};

export default Register;
