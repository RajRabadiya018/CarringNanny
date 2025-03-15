import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nanny-tabpanel-${index}`}
      aria-labelledby={`nanny-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const NannyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [nanny, setNanny] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  useEffect(() => {
    const fetchNanny = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(`/api/nannies/${id}`);
        setNanny(data);
      } catch (error) {
        console.error('Error fetching nanny:', error);
        setError('Failed to fetch nanny details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNanny();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!reviewComment.trim()) {
      setReviewError('Please provide a comment for your review');
      return;
    }

    try {
      await axios.post(`/api/nannies/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      setReviewSuccess(true);
      setReviewComment('');
      
      // Refresh nanny data to show the new review
      const { data } = await axios.get(`/api/nannies/${id}`);
      setNanny(data);
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError(
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to submit review. Please try again.'
      );
    }
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user.role !== 'parent') {
      alert('Only parents can book nannies');
    } else {
      navigate(`/booking/${id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!nanny) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Nanny not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={nanny.userId?.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'}
                alt={nanny.userId?.name}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {nanny.userId?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StyledRating value={nanny.averageRating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({nanny.reviews?.length || 0} reviews)
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalAtmIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  ${nanny.hourlyRate}/hour
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="body1">
                  {nanny.experience} {nanny.experience === 1 ? 'year' : 'years'} of experience
                </Typography>
              </Box>

              {nanny.specialNeeds && (
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Special Needs Trained" 
                  color="primary" 
                  sx={{ mb: 2 }} 
                />
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBookingClick}
                sx={{ mb: 2 }}
              >
                Book Now
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Languages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {nanny.languages?.map((language, index) => (
                  <Chip key={index} label={language} variant="outlined" size="small" />
                ))}
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {nanny.skills?.map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" size="small" />
                ))}
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Age Groups
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {nanny.ageGroupsServed?.map((ageGroup, index) => (
                  <Chip key={index} label={ageGroup} variant="outlined" size="small" />
                ))}
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {nanny.servicesOffered?.map((service, index) => (
                  <Chip key={index} label={service} variant="outlined" size="small" />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Availability
              </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {nanny.availability?.map((slot, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={slot.day}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {slot.startTime} - {slot.endTime}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
                {(!nanny.availability || nanny.availability.length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    No availability information provided.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Tabs for Bio, Reviews, Gallery */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="About" />
              <Tab label="Reviews" />
              <Tab label="Gallery" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  About {nanny.userId?.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {nanny.bio}
                </Typography>

                {nanny.education && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Education
                    </Typography>
                    <Typography variant="body1">{nanny.education}</Typography>
                  </Box>
                )}

                {nanny.certifications && nanny.certifications.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Certifications
                    </Typography>
                    <List>
                      {nanny.certifications.map((cert, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <VerifiedIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={cert.name}
                            secondary={`Issued by ${cert.issuedBy} (${cert.year})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Reviews & Ratings
                </Typography>

                {isAuthenticated && user.role === 'parent' && (
                  <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Write a Review
                    </Typography>
                    {reviewSuccess && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Your review has been submitted successfully!
                      </Alert>
                    )}
                    {reviewError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {reviewError}
                      </Alert>
                    )}
                    <Box component="form" onSubmit={handleReviewSubmit}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Rating
                        </Typography>
                        <Rating
                          name="review-rating"
                          value={reviewRating}
                          onChange={(event, newValue) => {
                            setReviewRating(newValue);
                          }}
                          precision={0.5}
                          size="large"
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Your Review"
                        multiline
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Button type="submit" variant="contained">
                        Submit Review
                      </Button>
                    </Box>
                  </Paper>
                )}

                {nanny.reviews && nanny.reviews.length > 0 ? (
                  nanny.reviews.map((review, index) => (
                    <Paper key={index} sx={{ p: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {review.userId?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {review.userId?.name || 'Anonymous'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
                          <Box sx={{ display: 'flex' }}>
                            <FormatQuoteIcon sx={{ mr: 1, transform: 'rotate(180deg)', color: 'text.secondary' }} />
                            <Typography variant="body1">{review.comment}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Alert severity="info">
                    No reviews yet. Be the first to review this nanny!
                  </Alert>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Photo Gallery
                </Typography>

                {nanny.gallery && nanny.gallery.length > 0 ? (
                  <ImageList sx={{ width: '100%' }} cols={3} gap={8}>
                    {nanny.gallery.map((item, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={item}
                          alt={`Gallery image ${index + 1}`}
                          loading="lazy"
                          style={{ borderRadius: 8 }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Alert severity="info">
                    No gallery images available.
                  </Alert>
                )}
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NannyProfile;
