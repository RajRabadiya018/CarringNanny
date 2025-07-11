import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
    alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewDialog } from '../components/reviews';
import { useAuth } from '../context/AuthContext';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'pending'
      ? theme.palette.warning.light
      : status === 'confirmed'
      ? theme.palette.success.light
      : status === 'completed'
      ? theme.palette.info.light
      : theme.palette.error.light,
  color:
    status === 'pending'
      ? theme.palette.warning.dark
      : status === 'confirmed'
      ? theme.palette.success.dark
      : status === 'completed'
      ? theme.palette.info.dark
      : theme.palette.error.dark,
  fontWeight: 'bold',
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Define fetchBookings function with useCallback to memoize it
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching bookings for parent dashboard...');
      const { data } = await axios.get('/api/bookings/parent');
      console.log('Bookings fetched successfully:', data.length);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      // Provide more specific error messages based on error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        console.error('Server responded with error:', error.response.data);
        const errorMessage = error.response.data.error || 'Failed to fetch your bookings. Please try again later.';
        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Failed to fetch your bookings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Redirect if not authenticated or not a parent
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'parent') {
      navigate('/');
      return;
    }

    fetchBookings();
  }, [navigate, isAuthenticated, user, fetchBookings]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelClick = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancelDialogOpen(true);
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setCancelBookingId(null);
    setCancelReason('');
  };

  const handleCancelConfirm = async () => {
    try {
      await axios.put(`/api/bookings/${cancelBookingId}/cancel`, {
        cancellationReason: cancelReason,
      });

      // Update bookings list
      setBookings(bookings.map(booking => 
        booking._id === cancelBookingId 
          ? { ...booking, status: 'cancelled', cancellationReason: cancelReason } 
          : booking
      ));

      handleCancelClose();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleReviewClose = () => {
    setReviewDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleReviewSubmitted = (review) => {
    // Refresh bookings after a successful review
    fetchBookings();
  };

  const getFilteredBookings = (status) => {
    if (status === 'active') {
      return bookings.filter(booking => ['pending', 'confirmed'].includes(booking.status));
    } else if (status === 'past') {
      return bookings.filter(booking => ['completed', 'cancelled'].includes(booking.status));
    }
    return bookings;
  };

  // Calculate dashboard statistics
  const activeBookings = getFilteredBookings('active').length || 0;
  const completedBookings = bookings.filter(booking => booking.status === 'completed').length || 0;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length || 0;
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length || 0;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '70vh', 
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Loading your bookings...</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        minHeight: '90vh',
        background: `linear-gradient(to bottom, ${alpha('#EDE7F6', 0.3)} 0%, rgba(255,255,255,0) 100%)`,
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Dashboard Header */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '60px',
                height: '4px',
                backgroundColor: 'primary.main',
                borderRadius: '2px'
              }
            }}
          >
            Parent Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Welcome back, {user?.name}! Manage your nanny bookings and appointments.
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'customColors.lightPurple',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  margin: '0 auto 16px',
                  color: 'white'
                }}
              >
                <EventIcon />
              </Box>
              <Typography variant="h4" fontWeight="bold">{activeBookings}</Typography>
              <Typography variant="body1" color="text.secondary">Active Bookings</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'customColors.pastelPink',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'secondary.main',
                  margin: '0 auto 16px',
                  color: 'white'
                }}
              >
                <AccessTimeIcon />
              </Box>
              <Typography variant="h4" fontWeight="bold">{pendingBookings}</Typography>
              <Typography variant="body1" color="text.secondary">Pending Requests</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'customColors.softBlue',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  margin: '0 auto 16px',
                  color: 'white'
                }}
              >
                <CheckCircleIcon />
              </Box>
              <Typography variant="h4" fontWeight="bold">{completedBookings}</Typography>
              <Typography variant="body1" color="text.secondary">Completed Bookings</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center',
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'customColors.softGray',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: 'error.main',
                  margin: '0 auto 16px',
                  color: 'white'
                }}
              >
                <CancelIcon />
              </Box>
              <Typography variant="h4" fontWeight="bold">{cancelledBookings}</Typography>
              <Typography variant="body1" color="text.secondary">Cancelled Bookings</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs & Bookings */}
        <Paper 
          sx={{ 
            width: '100%', 
            mb: 3, 
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                py: 2,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.02)'
                }
              }
            }}
          >
            <Tab 
              label="Active Bookings" 
              icon={<EventAvailableIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Past Bookings" 
              icon={<HistoryIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="All Bookings" 
              icon={<ListAltIcon />} 
              iconPosition="start"
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <BookingsList 
              bookings={getFilteredBookings('active')} 
              onCancelClick={handleCancelClick} 
              onReviewClick={handleReviewClick} 
              emptyMessage="You don't have any active bookings."
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <BookingsList 
              bookings={getFilteredBookings('past')} 
              onCancelClick={handleCancelClick} 
              onReviewClick={handleReviewClick} 
              emptyMessage="You don't have any past bookings."
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <BookingsList 
              bookings={bookings} 
              onCancelClick={handleCancelClick} 
              onReviewClick={handleReviewClick} 
              emptyMessage="You don't have any bookings yet."
            />
          </TabPanel>
        </Paper>

        {/* Cancel Booking Dialog */}
        <Dialog 
          open={cancelDialogOpen} 
          onClose={handleCancelClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxWidth: 500
            }
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 3 }}>
            <Typography variant="h5" fontWeight="bold">Cancel Booking</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Are you sure you want to cancel this booking? Please provide a reason for cancellation.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Cancellation Reason"
              fullWidth
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleCancelClose}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Back
            </Button>
            <Button 
              onClick={handleCancelConfirm} 
              color="error" 
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel Booking
            </Button>
          </DialogActions>
        </Dialog>

        {/* Review Dialog */}
        {selectedBooking && (
          <ReviewDialog
            open={reviewDialogOpen}
            onClose={handleReviewClose}
            nannyId={selectedBooking.nannyId._id}
            nannyName={selectedBooking.nannyId.userId.name}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </Container>
    </Box>
  );
};

const BookingsList = ({ bookings, onCancelClick, onReviewClick, emptyMessage }) => {
  if (bookings.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: '200px',
            height: '200px', 
            mx: 'auto',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: alpha('#E3F2FD', 0.5),
            color: 'primary.main'
          }}
        >
          <EventBusyIcon sx={{ fontSize: 80, opacity: 0.7 }} />
        </Box>
        <Alert 
          severity="info" 
          sx={{ 
            display: 'inline-flex',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          {emptyMessage}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking._id}>
            <Card 
              sx={{ 
                borderRadius: 3,
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Grid container spacing={2}>
                  {/* Nanny Info */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      position: 'relative'
                    }}>
                      <Avatar
                        src={booking.nannyId?.userId?.profileImage}
                        alt={booking.nannyName || booking.nannyId?.userId?.name || 'Nanny'}
                        sx={{ 
                          width: 100, 
                          height: 100, 
                          mb: 1.5,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          border: '4px solid white'
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold" align="center">
                        {booking.nannyName || booking.nannyId?.userId?.name || 'Nanny'}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'primary.main', 
                          fontWeight: 'bold',
                          bgcolor: 'customColors.lightPurple',
                          px: 2,
                          py: 0.5,
                          borderRadius: 5,
                          mt: 0.5,
                          fontSize: '0.9rem'
                        }} 
                        align="center"
                      >
                        ${booking.nannyId?.hourlyRate}/hour
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Booking Details */}
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <EventIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.3rem' }} />
                        <Typography variant="body1" fontWeight="medium">
                          {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <AccessTimeIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.3rem' }} />
                        <Typography variant="body1" fontWeight="medium">
                          {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationOnIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.3rem' }} />
                        <Typography variant="body1" fontWeight="medium">
                          {booking.location.address}, {booking.location.city}, {booking.location.state} {booking.location.zipCode}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <ChildCareIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.3rem' }} />
                        <Typography variant="body1" fontWeight="medium">
                          {booking.numberOfChildren} {booking.numberOfChildren === 1 ? 'child' : 'children'} (Ages: {booking.childrenAges.join(', ')})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <PersonIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.3rem' }} />
                        <Typography variant="body1" fontWeight="medium">
                          Service Type: {booking.serviceType === 'part-time' ? 'Part-time Care' : 'Full-time Care'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: '1.3rem' }} />
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>
                          Total: ₹{booking.totalPrice > 0 ? booking.totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : (booking.nannyId?.hourlyRate || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Status and Actions */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-end', 
                      height: '100%', 
                      justifyContent: 'space-between',
                      p: 1
                    }}>
                      <StatusChip
                        label={booking.status.toUpperCase()}
                        status={booking.status}
                      />
                      {booking.cancellationReason && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            mt: 2,
                            bgcolor: alpha('#FFF3E0', 0.5),
                            borderRadius: 2,
                            maxWidth: '100%',
                            border: '1px solid #FFE0B2'
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', color: 'warning.dark' }}>
                            Cancellation Reason:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.cancellationReason}
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {booking.specialRequests && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: alpha('#E3F2FD', 0.5),
                        borderRadius: 2,
                        border: '1px solid #BBDEFB'
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'info.dark', mb: 0.5 }}>
                        Special Requests:
                      </Typography>
                      <Typography variant="body2">{booking.specialRequests}</Typography>
                    </Paper>
                  </Box>
                )}
                
                {booking.status === 'confirmed' && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Alert 
                      severity="success" 
                      icon={<CheckCircleIcon fontSize="inherit" />} 
                      sx={{ 
                        mb: 1, 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      <AlertTitle>Booking Confirmed!</AlertTitle>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {booking.nannyId?.userId?.name || 'Nanny'} has accepted your booking request!
                      </Typography>
                      {booking.nannyMessage && (
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          "{booking.nannyMessage}"
                        </Typography>
                      )}
                    </Alert>
                  </Box>
                )}
                
                {booking.status === 'cancelled' && booking.nannyMessage && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Alert 
                      severity="error" 
                      icon={<CancelIcon fontSize="inherit" />}
                      sx={{ 
                        mb: 1, 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                    >
                      <AlertTitle>Booking Declined</AlertTitle>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {booking.nannyId?.userId?.name || 'Nanny'} has declined your booking request
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                        "{booking.nannyMessage}"
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </CardContent>

              <Divider />

              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                {/* Show different actions based on booking status */}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onCancelClick(booking._id)}
                    startIcon={<CancelIcon />}
                    sx={{ 
                      borderRadius: 6, 
                      mr: 1,
                      px: 2
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}

                {booking.status === 'completed' && !booking.reviewed && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onReviewClick(booking)}
                    startIcon={<RateReviewIcon />}
                    sx={{ 
                      borderRadius: 6, 
                      mr: 1,
                      px: 2
                    }}
                  >
                    Write Review
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PersonIcon />}
                  onClick={() => window.location.href = `/nannies/${booking.nannyId._id}`}
                  sx={{ 
                    borderRadius: 6,
                    px: 2
                  }}
                >
                  View Nanny
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ParentDashboard;
