import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Rating,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NannyDetails = () => {
  const { nannyId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [nanny, setNanny] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchNannyDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add a timestamp parameter to prevent caching
        const timestamp = new Date().getTime();
        const { data } = await axios.get(`/api/nannies/${nannyId}?t=${timestamp}`);
        
        // More detailed logging of the received data
        console.log('NANNY DETAILS - FULL DATA:', data);
        console.log('NANNY DETAILS - CONTACT INFO:', {
          nannyId: data._id,
          userId: data.userId?._id,
          name: data.userId?.name,
          phoneNumber: data.phoneNumber,
          userPhone: data.userId?.phone,
          location: data.location, 
          address: data.userId?.address,
          addressFormatted: formatAddress(data.userId?.address)
        });

        // Force the address and phone display by setting them directly if missing
        if (!data.phoneNumber && data.userId?.phone) {
          data.phoneNumber = data.userId.phone;
        }
        
        if (!data.location && data.userId?.address) {
          data.location = formatAddress(data.userId.address);
        }
        
        setNanny(data);
      } catch (error) {
        console.error('Error fetching nanny details:', error);
        setError(
          error.response && error.response.data.error
            ? error.response.data.error
            : 'Failed to fetch nanny details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchNannyReviews = async () => {
      try {
        setReviewsLoading(true);

        const { data } = await axios.get(`/api/nannies/${nannyId}/reviews`);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching nanny reviews:', error);
        // Don't set an error state for reviews to avoid disrupting the main content
      } finally {
        setReviewsLoading(false);
      }
    };

    if (nannyId) {
      fetchNannyDetails();
      fetchNannyReviews();
    }
  }, [nannyId]);

  const handleBookNanny = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/booking/${nannyId}` } });
      return;
    }

    navigate(`/booking/${nannyId}`);
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };

  const averageRating = nanny?.averageRating || calculateAverageRating();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/nannies')}>
          Back to Nanny Search
        </Button>
      </Container>
    );
  }

  if (!nanny) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Nanny not found</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/nannies')}>
          Back to Nanny Search
        </Button>
      </Container>
    );
  }

  // Convert availability object to array of days
  const availableDays = Object.entries(nanny.availability || {})
    .filter(([_, isAvailable]) => isAvailable)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

  return (
    <Container maxWidth="lg" sx={{ 
      py: 4,
      pt: { xs: 5, sm: 6, md: 7 },
      mt: { xs: 2, sm: 3, md: 4 }
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        {/* Header with background */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          p: { xs: 3, sm: 4, md: 5 },
          color: 'white' 
        }}>
          <Container maxWidth="md">
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  src={nanny.profileImage || ''}
                  alt={nanny.userId?.name}
                  sx={{ 
                    width: { xs: 140, sm: 160, md: 180 }, // Responsive size
                    height: { xs: 140, sm: 160, md: 180 }, // Responsive size
                    mx: { xs: 'auto', md: 0 }, 
                    border: '4px solid white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    bgcolor: 'grey.300',
                    fontSize: '3rem'  // Larger font for the initial
                  }}
                >
                  {nanny.userId?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
                  }}
                >
                  {nanny.userId?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                  <Rating
                    value={averageRating}
                    precision={0.5}
                    readOnly
                    size="large"
                    emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'white' }} fontSize="inherit" />}
                  />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {reviews && reviews.length > 0 
                      ? `${averageRating.toFixed(1)} (${reviews.length} reviews)`
                      : `No ratings (0 reviews)`}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2.5, // Increased spacing
                  '& svg': { fontSize: 22 } // Slightly larger icons
                }}>
                  <LocationOnIcon sx={{ mr: 1.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {nanny.location || formatAddress(nanny.userId?.address) || 'Location not specified'}
                  </Typography>
                  {user && user.role === 'nanny' && user._id === nanny.userId?._id && (
                    <Button 
                      size="small" 
                      variant="text" 
                      color="secondary" 
                      sx={{ ml: 1, minWidth: 0, p: 0.5 }}
                      onClick={() => navigate('/edit-profile')}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2.5, // Increased spacing
                  '& svg': { fontSize: 22 } // Slightly larger icons
                }}>
                  <PhoneIcon sx={{ mr: 1.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {nanny.phoneNumber || nanny.userId?.phone || 'Contact not specified'}
                  </Typography>
                  {user && user.role === 'nanny' && user._id === nanny.userId?._id && (
                    <Button 
                      size="small" 
                      variant="text" 
                      color="secondary" 
                      sx={{ ml: 1, minWidth: 0, p: 0.5 }}
                      onClick={() => navigate('/edit-profile')}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  '& svg': { fontSize: 22 } // Slightly larger icons
                }}>
                  <AccessTimeIcon sx={{ mr: 1.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{nanny.experience} years of experience</Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main content */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body1" paragraph>
                {nanny.bio}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Services Offered
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {nanny.servicesOffered && nanny.servicesOffered.length > 0 ? (
                  nanny.servicesOffered.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      icon={<LocalOfferIcon />}
                      color="primary"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No services specified.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Age Groups
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {nanny.ageGroupsServed && nanny.ageGroupsServed.length > 0 ? (
                  nanny.ageGroupsServed.map((ageGroup, index) => (
                    <Chip
                      key={index}
                      label={ageGroup}
                      icon={<ChildCareIcon />}
                      color="secondary"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No age groups specified.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Reviews Section */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  Reviews
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={averageRating} precision={0.5} readOnly size="medium" />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {reviews && reviews.length > 0 
                      ? `${averageRating.toFixed(1)}/5`
                      : `No ratings yet`}
                  </Typography>
                </Box>
              </Box>

              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : reviews.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {reviews.map((review, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={review.user?.profileImage}
                              alt={review.user?.name}
                              sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light' }}
                            >
                              {review.user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {review.user?.name}
                                </Typography>
                                {review.verified && (
                                  <VerifiedIcon 
                                    color="primary" 
                                    fontSize="small" 
                                    sx={{ ml: 0.5 }} 
                                    titleAccess="Verified Booking" 
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          {review.comment}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    No reviews yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Reviews will appear here after parents complete bookings with this nanny.
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <span style={{ color: '#3F51B5' }}>${nanny.hourlyRate}</span> / hour
                </Typography>

                <Box sx={{ my: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Weekly Availability
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        color={availableDays.includes(day) ? 'primary' : 'default'}
                        variant={availableDays.includes(day) ? 'filled' : 'outlined'}
                        icon={availableDays.includes(day) ? <EventAvailableIcon /> : <QueryBuilderIcon />}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  By booking with {nanny.userId?.name}, you agree to our Terms and Conditions.
                </Typography>
                {user && user.role === 'nanny' && user._id === nanny.userId?._id ? (
                  <Button
                    component={Link}
                    to="/nanny/dashboard"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Back to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={handleBookNanny}
                      sx={{ mb: 2 }}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => navigate('/nannies')}
                    >
                      Back to Nanny Search
                    </Button>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </Container>
  );
};

const formatAddress = (address) => {
  if (!address) return null;
  
  // If address is a string, return it directly
  if (typeof address === 'string') return address;
  
  // If it's an object with only a street property that contains a full address
  if (address.street && !address.city && !address.state && !address.zipCode && 
      (address.street.includes(',') || address.street.includes(' '))) {
    return address.street;
  }
  
  // If it's an object, format the parts
  const { street, city, state, zipCode } = address;
  let formatted = '';
  
  if (street) formatted += street;
  if (city) formatted += formatted ? `, ${city}` : city;
  if (state) formatted += formatted ? `, ${state}` : state;
  if (zipCode) formatted += formatted ? ` ${zipCode}` : zipCode;
  
  return formatted || null;
};

export default NannyDetails;
