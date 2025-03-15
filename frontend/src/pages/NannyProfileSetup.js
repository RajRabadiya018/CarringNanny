import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const NannyProfileSetup = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [nannyProfile, setNannyProfile] = useState(null);

  // Form state
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState(1);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState(['English']);
  const [education, setEducation] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [ageGroupsServed, setAgeGroupsServed] = useState([]);
  const [servicesOffered, setServicesOffered] = useState([]);
  // Contact details
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');

  // Options for multi-select fields
  const skillOptions = [
    'First Aid',
    'CPR Certified',
    'Early Childhood Education',
    'Meal Preparation',
    'Homework Help',
    'Potty Training',
    'Newborn Care',
    'Swimming',
    'Music',
    'Arts & Crafts',
    'Babysitting',
    'Tutoring',
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'Mandarin',
    'German',
    'Italian',
    'Portuguese',
    'Russian',
    'Japanese',
    'Arabic',
    'Hindi',
    'Bengali',
  ];

  const ageGroupOptions = [
    'Infant (0-1)',
    'Toddler (1-3)',
    'Preschool (3-5)',
    'School-age (5-12)',
    'Teenager (13-18)',
  ];

  const serviceOptions = [
    'Babysitting',
    'Full-time care',
    'Part-time care',
    'Overnight care',
    'Homework help',
    'Cooking',
    'Light housekeeping',
    'Transportation',
    'School pickup/dropoff',
    'Weekend care',
  ];

  // Define steps
  const steps = ['Basic Information', 'Skills & Experience', 'Services & Preferences', 'Contact Details'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'nanny') {
      navigate('/');
      return;
    }

    // Check if nanny already has a profile
    const fetchNannyProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/nannies/profile/me');
        setNannyProfile(data);
        
        // Pre-fill form with existing data
        setBio(data.bio || '');
        setExperience(data.experience || 1);
        setHourlyRate(data.hourlyRate || 15);
        setSkills(data.skills || []);
        setLanguages(data.languages || ['English']);
        setEducation(data.education || '');
        setSpecialNeeds(data.specialNeeds || false);
        setAgeGroupsServed(data.ageGroupsServed || []);
        setServicesOffered(data.servicesOffered || []);
        setPhoneNumber(data.phoneNumber || '');
        setLocation(data.location || '');
      } catch (error) {
        console.log('No profile found or error:', error);
        // If 404, it means no profile yet, which is fine
        if (error.response && error.response.status !== 404) {
          setError('Error fetching your profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNannyProfile();
  }, [isAuthenticated, user, navigate]);

  const handleNext = () => {
    // Validate current step before moving to next
    if (activeStep === 0) {
      if (!bio) {
        setError('Please provide a bio');
        return;
      }
    } else if (activeStep === 1) {
      if (experience < 0 || hourlyRate < 5) {
        setError('Please enter valid experience and hourly rate');
        return;
      }
    } else if (activeStep === 2) {
      if (ageGroupsServed.length === 0 || servicesOffered.length === 0) {
        setError('Please select at least one age group and service');
        return;
      }
    } else if (activeStep === 3) {
      if (!phoneNumber) {
        setError('Please provide a phone number');
        return;
      }
      if (!location) {
        setError('Please provide your location');
        return;
      }
    }

    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = {
        bio,
        experience: Number(experience),
        hourlyRate: Number(hourlyRate),
        skills,
        languages,
        education,
        specialNeeds,
        ageGroupsServed,
        servicesOffered,
        phoneNumber,
        location,
      };

      // Also update the user model with phone number
      const userData = {
        phone: phoneNumber, 
        address: {
          street: location.split(',')[0] || location, // First part of location as street
          city: location.split(',')[1]?.trim() || '', // Second part as city if available
          state: location.split(',')[2]?.trim() || '', // Third part as state if available
          zipCode: '' // We don't have a separate field for zipCode in this form
        }
      };

      if (nannyProfile) {
        // Update existing profile
        await axios.put(`/api/nannies/${nannyProfile._id}`, profileData);
        // Update user data
        await axios.put('/api/users/profile', userData);
      } else {
        // Create new profile
        await axios.post('/api/nannies', profileData);
        // Update user data
        await axios.put('/api/users/profile', userData);
      }

      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/nanny/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving nanny profile:', error);
      setError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to save your profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Render form based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tell us about yourself
            </Typography>
            <TextField
              label="Bio"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Share a bit about yourself, your childcare philosophy, and what makes you a great nanny"
              required
            />
            <TextField
              label="Education/Qualifications"
              multiline
              rows={2}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g., Bachelor's in Early Childhood Education, Montessori Certification, etc."
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills & Experience
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Years of Experience"
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hourly Rate (USD)"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{ 
                    inputProps: { min: 5 },
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Skills</InputLabel>
                  <Select
                    multiple
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    input={<OutlinedInput label="Skills" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {skillOptions.map((skill) => (
                      <MenuItem key={skill} value={skill}>
                        {skill}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Languages</InputLabel>
                  <Select
                    multiple
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    input={<OutlinedInput label="Languages" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Services & Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Age Groups You Work With</InputLabel>
                  <Select
                    multiple
                    value={ageGroupsServed}
                    onChange={(e) => setAgeGroupsServed(e.target.value)}
                    input={<OutlinedInput label="Age Groups You Work With" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {ageGroupOptions.map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Services Offered</InputLabel>
                  <Select
                    multiple
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                    input={<OutlinedInput label="Services Offered" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {serviceOptions.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={specialNeeds} 
                      onChange={(e) => setSpecialNeeds(e.target.checked)} 
                    />
                  }
                  label="I have experience working with children with special needs"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Details
            </Typography>
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter your phone number"
              required
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter your location"
              required
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading && !nannyProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {nannyProfile ? 'Edit Your Nanny Profile' : 'Complete Your Nanny Profile'}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          {nannyProfile 
            ? 'Update your profile to ensure parents can find you more easily'
            : 'Help parents find you by completing your nanny profile'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your profile has been saved successfully! Redirecting to your dashboard...
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 3 }} />

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={loading || success}
                sx={{ ml: 1 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  nannyProfile ? 'Update Profile' : 'Complete Profile'
                )}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NannyProfileSetup;
