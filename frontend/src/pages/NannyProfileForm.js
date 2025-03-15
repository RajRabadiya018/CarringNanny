import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NannyProfileForm = () => {
  const navigate = useNavigate();
  const { nannyId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(nannyId ? true : false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isEdit = Boolean(nannyId);

  // Form fields
  const [profileImage, setProfileImage] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [availability, setAvailability] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [ageGroups, setAgeGroups] = useState([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'nanny') {
      navigate('/');
      return;
    }

    // Fetch nanny profile if in edit mode
    if (isEdit) {
      fetchNannyProfile();
    }
  }, [isAuthenticated, navigate, user, isEdit]);

  const fetchNannyProfile = async () => {
    try {
      setInitialLoading(true);
      setError('');

      const { data } = await axios.get(`/api/nannies/${nannyId}`);
      
      // Set form data
      setProfileImage(data.profileImage || '');
      setBio(data.bio || '');
      setExperience(data.experience || '');
      setHourlyRate(data.hourlyRate || '');
      
      // Handle location data - could be a string or come from user.address object
      if (data.location) {
        // Try to parse the location if it's a full address string
        const parts = data.location.split(',').map(part => part.trim());
        if (parts.length >= 3) {
          setStreet(parts[0] || '');
          setCity(parts[1] || '');
          const stateZip = parts[2].split(' ');
          setState(stateZip[0] || '');
          setZipCode(stateZip[1] || '');
        } else {
          // If can't parse, just put it all in street
          setStreet(data.location);
        }
      } else if (data.userId && data.userId.address) {
        // Get from user address if available
        setStreet(data.userId.address.street || '');
        setCity(data.userId.address.city || '');
        setState(data.userId.address.state || '');
        setZipCode(data.userId.address.zipCode || '');
      }
      
      setPhoneNumber(data.phoneNumber || (data.userId && data.userId.phone) || '');
      setServices(data.services || []);
      setAgeGroups(data.ageGroups || []);
      
      if (data.availability) {
        setAvailability(data.availability);
      }
    } catch (error) {
      console.error('Error fetching nanny profile:', error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to fetch nanny profile. Please try again.'
      );
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Format full address from components
      const fullAddress = `${street}${city ? ', ' + city : ''}${state ? ', ' + state : ''}${zipCode ? ' ' + zipCode : ''}`;
      
      const nannyData = {
        profileImage,
        bio,
        experience: Number(experience),
        hourlyRate: Number(hourlyRate),
        location: fullAddress,
        phoneNumber,
        services,
        availability,
        ageGroups,
      };

      // Also update user profile with phone and address
      const userData = {
        phone: phoneNumber,
        address: {
          street,
          city,
          state,
          zipCode
        }
      };

      let response;
      if (isEdit) {
        response = await axios.put(`/api/nannies/${nannyId}`, nannyData);
        await axios.put('/api/users/profile', userData); // Update user profile
      } else {
        response = await axios.post('/api/nannies', nannyData);
        await axios.put('/api/users/profile', userData); // Update user profile
      }

      setSuccess(true);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/nanny/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving nanny profile:', error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to save nanny profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (serviceToRemove) => {
    setServices(services.filter(service => service !== serviceToRemove));
  };

  const handleAgeGroupChange = (e) => {
    setAgeGroups(e.target.value);
  };

  const handleAvailabilityChange = (day) => {
    setAvailability({
      ...availability,
      [day]: !availability[day],
    });
  };

  if (initialLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {isEdit ? 'Edit Nanny Profile' : 'Create Nanny Profile'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update your professional details' : 'Complete your profile to start receiving booking requests'}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>
          {isEdit ? 'Profile updated successfully!' : 'Profile created successfully!'}
        </Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={profileImage || 'https://via.placeholder.com/150'}
                alt={user?.name || 'Nanny Profile'}
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Hourly Rate"
                variant="outlined"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="25"
                helperText="Your hourly rate in USD"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Years of Experience"
                variant="outlined"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="3"
                helperText="Number of years of childcare experience"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Street Address"
                variant="outlined"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Main St"
                helperText="Enter your street address"
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                required
                label="City"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="State/Province"
                variant="outlined"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                label="Zip Code"
                variant="outlined"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 555-5555"
                helperText="Your contact phone number"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Bio"
                variant="outlined"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell families about yourself, your experience, and your approach to childcare"
                multiline
                rows={4}
                helperText={`${bio.length}/500 characters`}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="age-groups-label">Age Groups</InputLabel>
                <Select
                  labelId="age-groups-label"
                  id="age-groups"
                  multiple
                  value={ageGroups}
                  onChange={handleAgeGroupChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Infant (0-12 months)">Infant (0-12 months)</MenuItem>
                  <MenuItem value="Toddler (1-3 years)">Toddler (1-3 years)</MenuItem>
                  <MenuItem value="Preschool (3-5 years)">Preschool (3-5 years)</MenuItem>
                  <MenuItem value="School-age (6-12 years)">School-age (6-12 years)</MenuItem>
                  <MenuItem value="Teen (13+ years)">Teen (13+ years)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Services Offered
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add a service"
                  variant="outlined"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g., Meal preparation, Homework help"
                  sx={{ mr: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddService}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {services.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    onDelete={() => handleRemoveService(service)}
                    deleteIcon={<DeleteIcon />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Weekly Availability
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(availability).map(([day, isAvailable]) => (
                  <Chip
                    key={day}
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    onClick={() => handleAvailabilityChange(day)}
                    color={isAvailable ? 'primary' : 'default'}
                    variant={isAvailable ? 'filled' : 'outlined'}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Click on days to toggle availability
              </Typography>
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
                {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update Profile' : 'Create Profile')}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate('/nanny/dashboard')}
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

export default NannyProfileForm;
