import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Rating,
    Slider,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { addDays, addHours, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookingRequest = () => {
  const { nannyId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [nanny, setNanny] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Booking form state
  const [bookingDate, setBookingDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(addHours(new Date(), 3));
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [childrenAges, setChildrenAges] = useState(['']);
  const [specialRequests, setSpecialRequests] = useState('');
  const [serviceType, setServiceType] = useState('part-time');
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    // Redirect if not authenticated or not a parent
    if (!isAuthenticated) {
      navigate('/login?redirect=booking');
      return;
    }

    if (user && user.role !== 'parent') {
      navigate('/');
      return;
    }

    const fetchNanny = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`/api/nannies/${nannyId}`);
        setNanny(data);
      } catch (error) {
        console.error('Error fetching nanny:', error);
        setError('Failed to fetch nanny details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNanny();
  }, [nannyId, navigate, isAuthenticated, user]);

  const handleChildrenAgesChange = (index, value) => {
    const newAges = [...childrenAges];
    newAges[index] = value;
    setChildrenAges(newAges);
  };

  const addChildAge = () => {
    setChildrenAges([...childrenAges, '']);
  };

  const removeChildAge = (index) => {
    const newAges = [...childrenAges];
    newAges.splice(index, 1);
    setChildrenAges(newAges);
  };

  const handleLocationChange = (field, value) => {
    setLocation({
      ...location,
      [field]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate date and time
    if (!bookingDate) {
      errors.date = 'Booking date is required';
      isValid = false;
    }

    if (!startTime) {
      errors.startTime = 'Start time is required';
      isValid = false;
    }

    if (!endTime) {
      errors.endTime = 'End time is required';
      isValid = false;
    }

    // Check if end time is after start time
    if (startTime && endTime && startTime >= endTime) {
      errors.endTime = 'End time must be after start time';
      isValid = false;
    }

    // Validate number of days
    if (numberOfDays < 1) {
      errors.numberOfDays = 'Number of days must be at least 1';
      isValid = false;
    }

    // Validate children ages
    for (let i = 0; i < childrenAges.length; i++) {
      if (!childrenAges[i]) {
        errors[`childAge${i}`] = 'Age is required';
        isValid = false;
      }
    }

    // Validate location
    if (!location.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!location.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }

    if (!location.state.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }

    if (!location.zipCode.trim()) {
      errors.zipCode = 'Zip code is required';
      isValid = false;
    }

    // Validate service type
    if (!serviceType) {
      errors.serviceType = 'Service type is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Clear previous errors
    setFormErrors({});
    setBookingError('');
    
    // Combine date with start and end times
    const startDateTime = new Date(bookingDate);
    startDateTime.setHours(
      startTime.getHours(),
      startTime.getMinutes(),
      0,
      0
    );
    
    const endDateTime = new Date(bookingDate);
    endDateTime.setHours(
      endTime.getHours(),
      endTime.getMinutes(),
      0,
      0
    );
    
    // Calculate total price
    const totalPrice = calculateTotalPrice();
    console.log(`Final calculated price for submission: ₹${totalPrice}`);

    try {
      const bookingData = {
        nannyId,
        nannyName: nanny.userId?.name || 'Nanny',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        numberOfDays,
        numberOfChildren,
        childrenAges: childrenAges.map(age => parseInt(age)),
        specialRequests,
        location,
        totalPrice,
        serviceType
      };

      console.log('Sending booking data:', bookingData);
      const response = await axios.post('/api/bookings', bookingData);
      console.log('Booking successful:', response.data);
      setBookingSuccess(true);

      // Reset form
      setBookingDate(new Date());
      setStartTime(new Date());
      setEndTime(addHours(new Date(), 3));
      setNumberOfDays(1);
      setNumberOfChildren(1);
      setChildrenAges(['']);
      setSpecialRequests('');
      setServiceType('part-time');
      setLocation({
        address: '',
        city: '',
        state: '',
        zipCode: '',
      });

      // Redirect to parent dashboard after a short delay
      setTimeout(() => {
        navigate('/parent/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to create booking. Please try again.'
      );
    }
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    if (!startTime || !endTime || !nanny) {
      console.log('calculateTotalPrice: Missing required data for calculation');
      return 0;
    }
    
    // Calculate duration in hours
    const startHour = startTime.getHours() + (startTime.getMinutes() / 60);
    const endHour = endTime.getHours() + (endTime.getMinutes() / 60);
    
    // Calculate hours properly accounting for times that might span across days
    let durationHours = endHour - startHour;
    if (durationHours < 0) {
      durationHours += 24; // Add 24 hours if end time is on the next day
    }
    
    console.log(`Duration calculation: ${startHour} to ${endHour} = ${durationHours}hrs`);
    
    if (durationHours <= 0) {
      console.log('calculateTotalPrice: Duration is zero or negative');
      return 0;
    }
    
    // Make sure hourly rate is treated as a number
    const hourlyRate = parseFloat(nanny.hourlyRate) || 0;
    console.log(`Calculating price with: hourlyRate=${hourlyRate}, hours=${durationHours}, days=${numberOfDays}`);
    
    // Calculate base price (hourly rate × hours × days)
    const basePrice = hourlyRate * durationHours * numberOfDays;
    console.log(`Base price calculation: ${hourlyRate} × ${durationHours} × ${numberOfDays} = ${basePrice}`);
    
    // Apply any service type multiplier if needed
    let finalPrice = basePrice;
    if (serviceType === 'full-time') {
      // Apply a small discount for full-time bookings
      finalPrice = basePrice * 0.95;
      console.log(`Applied full-time discount: ${basePrice} × 0.95 = ${finalPrice}`);
    }
    
    // Round to 2 decimal places and ensure it's a number
    finalPrice = Math.round(finalPrice * 100) / 100;
    console.log(`Final calculated price: ₹${finalPrice}`);
    
    if (isNaN(finalPrice) || finalPrice < 0) {
      console.warn('Invalid price calculated, defaulting to hourly rate');
      return hourlyRate; // Return at least the hourly rate
    }
    
    // Ensure we never return 0 if we have an hourly rate
    if (finalPrice === 0 && hourlyRate > 0) {
      console.log(`Price was 0 but hourly rate is ${hourlyRate}, returning hourly rate`);
      return hourlyRate;
    }
    
    return finalPrice;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6, mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!nanny) {
    return (
      <Container maxWidth="md" sx={{ py: 6, mt: 2 }}>
        <Alert severity="error">Nanny not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 }, mt: { xs: 4, md: 5 } }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: 3,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(to right, #f8f9fa, #ffffff)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            color: 'primary.main',
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '40%',
              height: 3,
              bgcolor: 'primary.main',
              borderRadius: 2
            }
          }}
        >
          Book a Session with {nanny.userId?.name || 'Nanny'}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Complete the form below to request a booking with this nanny.
        </Typography>
      </Paper>

      {bookingSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Booking request sent successfully! The nanny will be notified and will respond to your request soon.
          You will be redirected to your dashboard...
        </Alert>
      )}

      {bookingError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {bookingError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Nanny Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            mb: 3, 
            height: '100%',
            boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 28px rgba(0,0,0,0.1)'
            }
          }}>
            <CardMedia
              component="img"
              height="220"
              image={nanny.userId?.profileImage || `https://ui-avatars.com/api/?name=${nanny.userId?.name || 'Nanny'}&background=random&size=256`}
              alt={nanny.userId?.name}
              sx={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {nanny.userId?.name || 'Nanny'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={nanny.averageRating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({nanny.reviews?.length || 0} reviews)
                </Typography>
              </Box>
              
              <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
              ₹{nanny.hourlyRate}/hr
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <WorkIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                <strong>Experience:</strong>&nbsp;{nanny.experience} {nanny.experience === 1 ? 'year' : 'years'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                <strong>Location:</strong>&nbsp;{nanny.location || 'Not specified'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <ChildCareIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                <strong>Age Group:</strong>&nbsp;{nanny.ageGroup || 'All ages'}
              </Typography>
              
              {nanny.qualifications && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Qualifications:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {nanny.qualifications}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Booking Form */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 3 }, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Booking Details
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative' }}>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: -10, 
                  right: -10, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.lighter', 
                  opacity: 0.2,
                  zIndex: 0
                }} 
              />
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={3}>
                  {/* Date */}
                  <Grid item xs={12} sm={4}>
                    <Typography 
                      variant="subtitle2" 
                      component="label" 
                      sx={{ mb: 1, display: 'block', fontWeight: 600 }}
                    >
                      Date
                    </Typography>
                    <DatePicker
                      value={bookingDate}
                      onChange={(newDate) => setBookingDate(newDate)}
                      disablePast
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={Boolean(formErrors.date)}
                          helperText={formErrors.date}
                          sx={{ 
                            "& .MuiInputBase-root": { 
                              background: "white",
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              transition: 'all 0.2s',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Start Time */}
                  <Grid item xs={12} sm={4}>
                    <Typography 
                      variant="subtitle2" 
                      component="label" 
                      sx={{ mb: 1, display: 'block', fontWeight: 600 }}
                    >
                      Start Time
                    </Typography>
                    <TimePicker
                      value={startTime}
                      onChange={(newTime) => setStartTime(newTime)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={Boolean(formErrors.startTime)}
                          helperText={formErrors.startTime}
                          sx={{ 
                            "& .MuiInputBase-root": { 
                              background: "white",
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              transition: 'all 0.2s',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* End Time */}
                  <Grid item xs={12} sm={4}>
                    <Typography 
                      variant="subtitle2" 
                      component="label" 
                      sx={{ mb: 1, display: 'block', fontWeight: 600 }}
                    >
                      End Time
                    </Typography>
                    <TimePicker
                      value={endTime}
                      onChange={(newTime) => setEndTime(newTime)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={Boolean(formErrors.endTime)}
                          helperText={formErrors.endTime}
                          sx={{ 
                            "& .MuiInputBase-root": { 
                              background: "white",
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              transition: 'all 0.2s',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              
              {/* Number of Days */}
              <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Duration in Days
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={numberOfDays}
                      onChange={(e, newValue) => setNumberOfDays(newValue)}
                      step={1}
                      marks
                      min={1}
                      max={14}
                      valueLabelDisplay="auto"
                      aria-labelledby="days-slider"
                      sx={{ 
                        color: theme.palette.primary.main,
                        height: 8,
                        '& .MuiSlider-track': {
                          border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                          height: 24,
                          width: 24,
                          backgroundColor: '#fff',
                          border: `2px solid ${theme.palette.primary.main}`,
                          '&:focus, &:hover': {
                            boxShadow: `0 0 0 8px ${theme.palette.primary.main}30`,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Days"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={numberOfDays}
                      onChange={(e) => setNumberOfDays(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                      inputProps={{
                        step: 1,
                        min: 1,
                        max: 14,
                        type: 'number',
                      }}
                      error={Boolean(formErrors.numberOfDays)}
                      helperText={formErrors.numberOfDays}
                      sx={{ 
                        width: '80px',
                        "& .MuiInputBase-root": { 
                          background: "white",
                          borderRadius: 1
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {numberOfDays > 1 
                    ? `Your booking will start on ${format(bookingDate, 'MMMM d, yyyy')} and end on ${format(addDays(bookingDate, numberOfDays - 1), 'MMMM d, yyyy')}`
                    : 'Single day booking'}
                </Typography>
              </Box>
              
              {/* Service Type */}
              <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Service Type
                </Typography>
                
                <FormControl component="fieldset" error={Boolean(formErrors.serviceType)} sx={{ ml: 2 }}>
                  <RadioGroup
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    row
                  >
                    <FormControlLabel value="part-time" control={<Radio />} label="Part-time Care" />
                    <FormControlLabel value="full-time" control={<Radio />} label="Full-time Care" />
                  </RadioGroup>
                  {formErrors.serviceType && (
                    <FormHelperText error>{formErrors.serviceType}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              
              {/* Children Information */}
              <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Children Information
                </Typography>
                
                {childrenAges.map((age, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      label={`Child ${index + 1} Age`}
                      type="number"
                      value={age}
                      onChange={(e) => handleChildrenAgesChange(index, e.target.value)}
                      InputProps={{ inputProps: { min: 0, max: 17 } }}
                      fullWidth
                      error={Boolean(formErrors[`childAge${index}`])}
                      helperText={formErrors[`childAge${index}`]}
                      sx={{ 
                        mr: 2,
                        "& .MuiInputBase-root": { 
                          background: "white",
                          borderRadius: 1
                        }
                      }}
                    />
                    
                    {index > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeChildAge(index)}
                        sx={{ minWidth: '100px' }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                ))}
                
                <Button
                  variant="outlined"
                  onClick={addChildAge}
                  sx={{ mt: 1 }}
                >
                  Add Another Child
                </Button>
              </Box>
              
              {/* Location Details */}
              <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '30%',
                    height: 2,
                    bgcolor: 'primary.main',
                    borderRadius: 2
                  }
                }}>
                  Location Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      value={location.address}
                      onChange={(e) => handleLocationChange('address', e.target.value)}
                      fullWidth
                      error={Boolean(formErrors.address)}
                      helperText={formErrors.address}
                      sx={{ 
                        "& .MuiInputBase-root": { 
                          background: "white",
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="City"
                      value={location.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      fullWidth
                      error={Boolean(formErrors.city)}
                      helperText={formErrors.city}
                      sx={{ 
                        "& .MuiInputBase-root": { 
                          background: "white",
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="State"
                      value={location.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      fullWidth
                      error={Boolean(formErrors.state)}
                      helperText={formErrors.state}
                      sx={{ 
                        "& .MuiInputBase-root": { 
                          background: "white",
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Zip Code"
                      value={location.zipCode}
                      onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                      fullWidth
                      error={Boolean(formErrors.zipCode)}
                      helperText={formErrors.zipCode}
                      sx={{ 
                        "& .MuiInputBase-root": { 
                          background: "white",
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* Special Requests */}
              <Box sx={{ mt: 3, mb: 4 }}>
                <TextField
                  label="Special Requests (Optional)"
                  multiline
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  fullWidth
                  sx={{ 
                    "& .MuiInputBase-root": { 
                      background: "white",
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }
                  }}
                />
              </Box>
              
              {/* Booking Summary */}
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'primary.lighter', 
                borderRadius: 2,
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Booking Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date: {bookingDate?.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time: {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Number of Days: {numberOfDays}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Number of Children: {numberOfChildren}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Service Type: {serviceType === 'part-time' ? 'Part-time Care' : 'Full-time Care'}
                    </Typography>
                    <Typography variant="h6" color="primary.dark" sx={{ mt: 1, fontWeight: 'bold' }}>
                      Total Price: ₹{calculateTotalPrice()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 20px rgba(125, 87, 194, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 24px rgba(125, 87, 194, 0.3)'
                    }
                  }}
                >
                  Submit Booking Request
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookingRequest;
