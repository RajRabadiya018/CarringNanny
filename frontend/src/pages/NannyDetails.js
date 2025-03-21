import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
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
      py: 3,
      pt: { xs: 4, sm: 5, md: 6 },
      mt: { xs: 2, sm: 3, md: 4 }
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        maxWidth: '85%',
        mx: 'auto'
      }}>
        {/* Header with background */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          p: { xs: 2, sm: 2.5, md: 3 },
          color: 'white' 
        }}>
          <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  src={nanny.profileImage || ''}
                  alt={nanny.userId?.name}
                  sx={{ 
                    width: { xs: 110, sm: 130, md: 140 }, // Reduced size
                    height: { xs: 110, sm: 130, md: 140 }, // Reduced size
                    mx: { xs: 'auto', md: 0 }, 
                    border: '3px solid white',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    bgcolor: 'grey.300',
                    fontSize: '2.5rem'  // Smaller font for the initial
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
                    mb: 1.5,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                  }}
                >
                  {nanny.userId?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 0.75 }}>
                  <Rating
                    value={averageRating}
                    precision={0.5}
                    readOnly
                    size="medium"
                    emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'white' }} fontSize="inherit" />}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {reviews && reviews.length > 0 
                      ? `${averageRating.toFixed(1)} (${reviews.length} reviews)`
                      : `No ratings (0 reviews)`}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5, // Reduced spacing
                  '& svg': { fontSize: 18 } // Smaller icons
                }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                  mb: 1.5, // Reduced spacing
                  '& svg': { fontSize: 18 } // Smaller icons
                }}>
                  <PhoneIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                  '& svg': { fontSize: 18 } // Smaller icons
                }}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{nanny.experience} years of experience</Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main content */}
        <Container maxWidth="md" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.35rem' } }}>
                About Me
              </Typography>
              <Typography variant="body2" paragraph>
                {nanny.bio}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.35rem' } }}>
                Services Offered
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}>
                {nanny.servicesOffered && nanny.servicesOffered.length > 0 ? (
                  nanny.servicesOffered.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No services specified
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.35rem' } }}>
                Age Groups
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2.5 }}>
                {nanny.ageGroupsServed && nanny.ageGroupsServed.length > 0 ? (
                  nanny.ageGroupsServed.map((ageGroup, index) => (
                    <Chip
                      key={index}
                      label={ageGroup}
                      color="secondary"
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No age groups specified
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2.5 }} />

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

              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.35rem' } }}>
                Reviews
              </Typography>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review._id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 1.5 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          src={review.parentId?.profileImage}
                          alt={review.parentId?.name}
                          sx={{ width: 35, height: 35, mr: 1.5 }}
                        >
                          {review.parentId?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {review.parentId?.name || 'Anonymous Parent'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        {review.comment}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No reviews yet.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Paper elevation={1} sx={{ 
                  p: 2.5, 
                  borderRadius: 2, 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                  border: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    Booking Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <EventAvailableIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.1rem' }} />
                      <Typography variant="body2" fontWeight="medium">
                        Available Days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 2.5 }}>
                      {availableDays.length > 0 ? (
                        availableDays.map((day) => (
                          <Chip 
                            key={day} 
                            label={day} 
                            size="small"
                            sx={{ fontSize: '0.7rem', height: 22 }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Availability not specified
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <QueryBuilderIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.1rem' }} />
                      <Typography variant="body2" fontWeight="medium">
                        Hourly Rate
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h6" 
                      color="primary.main" 
                      sx={{ 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center',
                        pl: 2.5,
                        fontSize: '1.2rem'
                      }}
                    >
                      ${nanny.hourlyRate}/hr
                      {nanny.verifiedNanny && (
                        <Chip 
                          icon={<VerifiedIcon fontSize="small" />} 
                          label="Verified" 
                          color="primary" 
                          size="small" 
                          sx={{ ml: 1, fontSize: '0.7rem', height: 22 }} 
                        />
                      )}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                    By booking with {nanny.userId?.name}, you agree to our Terms and Conditions.
                  </Typography>
                  {user && user.role === 'nanny' && user._id === nanny.userId?._id ? (
                    <Button
                      component={Link}
                      to="/nanny/dashboard"
                      variant="contained"
                      fullWidth
                      size="small"
                      sx={{ 
                        mt: 1.5,
                        py: 1,
                        fontSize: '0.85rem'
                      }}
                    >
                      Back to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="small"
                        onClick={handleBookNanny}
                        sx={{ 
                          mb: 1,
                          py: 1,
                          fontSize: '0.85rem'
                        }}
                      >
                        Book Now
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        size="small"
                        onClick={() => navigate('/nannies')}
                        sx={{ 
                          fontSize: '0.85rem',
                          py: 0.75
                        }}
                      >
                        Back to Nanny Search
                      </Button>
                    </>
                  )}
                </Paper>
              </Box>
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
