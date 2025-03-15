import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Set initial form values
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      // Handle address object or string
      if (user.address) {
        if (typeof user.address === 'object') {
          setStreet(user.address.street || '');
          setCity(user.address.city || '');
          setState(user.address.state || '');
          setZipCode(user.address.zipCode || '');
        } else if (typeof user.address === 'string') {
          setStreet(user.address); // Store the whole address string in street field
        }
      }
      setProfileImage(user.profileImage || '');
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Format full address for location field
      const fullAddress = `${street}${city ? ', ' + city : ''}${state ? ', ' + state : ''}${zipCode ? ' ' + zipCode : ''}`;
      
      // Create address object
      const addressObject = {
        street,
        city,
        state,
        zipCode
      };
      
      console.log('Updating user profile with:', {
        name,
        phone,
        address: addressObject,
        profileImage,
        formattedAddress: fullAddress
      });

      const { data } = await axios.put('/api/users/profile', {
        name,
        phone,
        address: addressObject, // Send as object
        profileImage,
      });

      // Update context with new user data
      updateProfile({
        ...user,
        name: data.name,
        phone: data.phone,
        address: data.address,
        profileImage: data.profileImage,
      });

      // If user is a nanny, also update the nanny profile with contact info
      if (user && user.role === 'nanny') {
        try {
          // Get the nanny profile first
          const nannyResponse = await axios.get('/api/nannies/profile/me');
          const nannyProfile = nannyResponse.data;
          
          console.log('Current nanny profile:', nannyProfile);
          
          // Update the nanny profile with the new contact info
          const updateResponse = await axios.put(`/api/nannies/${nannyProfile._id}`, {
            phoneNumber: phone,
            location: fullAddress
          });
          
          console.log('Nanny profile updated with:', {
            phoneNumber: phone,
            location: fullAddress,
            response: updateResponse.data
          });
          
          // Perform an additional update to force refresh the nanny profile
          setTimeout(async () => {
            try {
              const verifyResponse = await axios.get(`/api/nannies/${nannyProfile._id}?t=${new Date().getTime()}`);
              console.log('Verified nanny profile after update:', {
                phoneNumber: verifyResponse.data.phoneNumber,
                location: verifyResponse.data.location
              });
            } catch (verifyError) {
              console.error('Error verifying nanny profile update:', verifyError);
            }
          }, 1000);
          
        } catch (nannyError) {
          console.error('Error updating nanny profile:', nannyError);
          // Don't fail the whole operation if this part fails
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Edit Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update your personal information
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>Profile updated successfully!</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={profileImage || 'https://via.placeholder.com/150'}
                alt={name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Image URL"
                variant="outlined"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="Enter image URL"
                helperText="Enter a URL for your profile image"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                variant="outlined"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter your street address"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State/Province"
                variant="outlined"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter your state"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Zip/Postal Code"
                variant="outlined"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your zip code"
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate(user?.role === 'parent' ? '/parent/dashboard' : '/nanny/dashboard')}
              >
                Back to Dashboard
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfile;
