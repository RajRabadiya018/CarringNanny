import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
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
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'pending'
      ? theme.palette.warning.light
      : status === 'confirmed'
      ? '#EDE7F6'
      : status === 'completed'
      ? '#E8EAF6'
      : theme.palette.error.light,
  color:
    status === 'pending'
      ? theme.palette.warning.dark
      : status === 'confirmed'
      ? '#6a1b9a'
      : status === 'completed'
      ? '#3f51b5'
      : theme.palette.error.dark,
  fontWeight: 'bold',
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
};

const NannyDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseBookingId, setResponseBookingId] = useState(null);
  const [responseAction, setResponseAction] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeBookingId, setCompleteBookingId] = useState(null);
  const [completeNotes, setCompleteNotes] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDetailDialogOpen, setViewDetailDialogOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not a nanny
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'nanny') {
      navigate('/');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get('/api/bookings/nanny');
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, isAuthenticated, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResponseClick = (bookingId, action) => {
    setResponseBookingId(bookingId);
    setResponseAction(action);
    setResponseDialogOpen(true);
  };

  const handleResponseClose = () => {
    setResponseDialogOpen(false);
    setResponseBookingId(null);
    setResponseAction(null);
    setResponseMessage('');
  };

  const handleResponseConfirm = async () => {
    try {
      // Use different endpoints based on action type
      const action = responseAction === 'accept' ? 'direct-accept' : 'decline';
      
      const requestData = {
        message: responseMessage || ''  // Ensure message is never undefined
      };
      
      console.log(`Sending ${action} request:`, {
        bookingId: responseBookingId,
        action: action,
        requestUrl: `/api/bookings/${responseBookingId}/${action}`,
        data: requestData
      });
      
      try {
        const response = await axios.put(`/api/bookings/${responseBookingId}/${action}`, requestData);
        console.log(`${action} response:`, response.data);
        
        // Update the UI immediately after successful API call
        setBookings(bookings.map(booking => 
          booking._id === responseBookingId 
            ? { 
                ...booking, 
                status: responseAction === 'accept' ? 'confirmed' : 'cancelled',
                nannyMessage: responseMessage || '' 
              } 
            : booking
        ));

        // Show success message
        setError(null);
        handleResponseClose();
      } catch (axiosError) {
        console.error(`Error ${responseAction}ing booking:`, axiosError);
        console.log('Error details:', {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          responseData: axiosError.response?.data
        });
        
        let errorMessage = `Failed to ${responseAction} booking. Please try again.`;
        
        // Extract more specific error message if available
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
          errorMessage = `Failed to ${responseAction} booking: ${axiosError.response.data.error}`;
        }
        
        setError(errorMessage);
      }
    } catch (generalError) {
      console.error(`General error in handleResponseConfirm:`, generalError);
      setError(`An unexpected error occurred. Please try again.`);
    }
  };

  const handleCompleteClick = (bookingId) => {
    setCompleteBookingId(bookingId);
    setCompleteDialogOpen(true);
  };

  const handleCompleteClose = () => {
    setCompleteDialogOpen(false);
    setCompleteBookingId(null);
    setCompleteNotes('');
  };

  const handleCompleteConfirm = async () => {
    try {      
      await axios.put(`/api/bookings/${completeBookingId}/complete`, {
        completionNotes: completeNotes,
      });

      // Update bookings list
      setBookings(bookings.map(booking => 
        booking._id === completeBookingId 
          ? { 
              ...booking, 
              status: 'completed',
              completionNotes: completeNotes 
            } 
          : booking
      ));

      handleCompleteClose();
    } catch (error) {
      console.error('Error completing booking:', error);
      setError('Failed to mark booking as completed. Please try again.');
    }
  };

  const getFilteredBookings = (status) => {
    if (status === 'pending') {
      return bookings.filter(booking => booking.status === 'pending');
    } else if (status === 'upcoming') {
      return bookings.filter(booking => booking.status === 'confirmed');
    } else if (status === 'past') {
      return bookings.filter(booking => ['completed', 'cancelled'].includes(booking.status));
    }
    return bookings;
  };

  // Function to render booking lists
  const renderBookingsList = (status) => {
    const filteredBookings = status === 'confirmed' 
      ? getFilteredBookings('upcoming') 
      : status === 'completed' 
        ? getFilteredBookings('past')
        : status === 'cancelled'
          ? bookings.filter(booking => booking.status === 'cancelled')
          : getFilteredBookings('pending');
          
    if (filteredBookings.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mb: 3
          }}>
            {status === 'pending' && (
              <PendingActionsIcon sx={{ fontSize: 80, color: 'warning.light', opacity: 0.8 }} />
            )}
            {status === 'confirmed' && (
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.light', opacity: 0.8 }} />
            )}
            {status === 'completed' && (
              <AssignmentIcon sx={{ fontSize: 80, color: '#3f51b5', opacity: 0.8 }} />
            )}
            {status === 'cancelled' && (
              <CancelIcon sx={{ fontSize: 80, color: 'error.light', opacity: 0.8 }} />
            )}
          </Box>
          <Typography variant="h6" color="text.primary" gutterBottom>
            No {status} bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {status === 'pending' && "You don't have any pending booking requests."}
            {status === 'confirmed' && "You don't have any confirmed bookings."}
            {status === 'completed' && "You don't have any completed bookings."}
            {status === 'cancelled' && "You don't have any declined bookings."}
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {filteredBookings.map((booking) => (
            <Grid item xs={12} md={6} lg={4} key={booking._id}>
              <Paper 
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#f5f5f5',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={booking.parent?.profilePicture || booking.parentId?.profilePicture}
                    alt={(booking.parent?.firstName && booking.parent?.lastName) ? 
                         `${booking.parent.firstName} ${booking.parent.lastName}` : 
                         booking.parentId?.name || "Parent"}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h3" fontWeight={500}>
                      {(booking.parent?.firstName && booking.parent?.lastName) ? 
                       `${booking.parent.firstName} ${booking.parent.lastName}` : 
                       booking.parent?.fullName || booking.parentId?.name || "Parent"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: getStatusColor(booking.status, 'light'),
                      color: getStatusColor(booking.status, 'main'),
                      px: 2,
                      py: 0.5,
                      borderRadius: 10,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {booking.status}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonthIcon 
                    sx={{ color: 'text.secondary', fontSize: '1rem', mr: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(booking.startTime).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon 
                    sx={{ color: 'text.secondary', fontSize: '1rem', mr: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {booking.notes || "No additional notes provided."}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ChildCareIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {booking.childrenCount} {booking.childrenCount === 1 ? 'child' : 'children'}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 'auto' }}>
                  {status === 'pending' && (
                    <>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => handleResponseClick(booking._id, 'accept')}
                          startIcon={<CheckIcon />}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => handleResponseClick(booking._id, 'decline')}
                          startIcon={<CloseIcon />}
                        >
                          Decline
                        </Button>
                      </Box>
                      <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          setSelectedBooking(booking);
                          setViewDetailDialogOpen(true);
                        }}
                        startIcon={<VisibilityIcon />}
                        sx={{ color: '#7b1fa2', '&:hover': { bgcolor: 'rgba(123, 31, 162, 0.08)' } }}
                      >
                        View Details
                      </Button>
                    </>
                  )}
                  
                  {status === 'confirmed' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleCompleteClick(booking._id)}
                        startIcon={<CheckIcon />}
                        sx={{ mb: 2, bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
                      >
                        Mark as Complete
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          setSelectedBooking(booking);
                          setViewDetailDialogOpen(true);
                        }}
                        startIcon={<VisibilityIcon />}
                        sx={{ color: '#7b1fa2', '&:hover': { bgcolor: 'rgba(123, 31, 162, 0.08)' } }}
                      >
                        View Details
                      </Button>
                    </>
                  )}
                  
                  {(status === 'completed' || status === 'cancelled') && (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        // Open a dialog to show details instead of navigating
                        setSelectedBooking(booking);
                        setViewDetailDialogOpen(true);
                      }}
                      startIcon={<VisibilityIcon />}
                      sx={{ color: '#7b1fa2', borderColor: '#7b1fa2', '&:hover': { borderColor: '#6a1b9a', bgcolor: 'rgba(123, 31, 162, 0.08)' } }}
                    >
                      View Details
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Status color helper function
  const getStatusColor = (status, shade = 'main') => {
    const colors = {
      pending: { main: 'warning.main', light: 'warning.lighter' },
      confirmed: { main: '#7C4DFF', light: '#EDE7F6' },      // Matching our new success color
      completed: { main: '#3F51B5', light: '#E8EAF6' },      // Matching our new secondary color
      cancelled: { main: 'error.main', light: 'error.lighter' }
    };
    return colors[status]?.[shade] || colors.pending[shade];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 }, mt: { xs: 4, md: 5 } }}>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #7e57c2 0%, #5e35b1 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.1 }}>
          <ChildCareIcon sx={{ fontSize: 180, transform: 'rotate(15deg)' }} />
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
              Welcome back, {user?.firstName || 'Nanny'}!
      </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Manage your bookings and connect with families all in one place.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Box 
                sx={{ 
                  bgcolor: 'white', 
                  borderRadius: '50%', 
                  p: 0.5,
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  border: '4px solid rgba(255,255,255,0.2)'
                }}
              >
                <Avatar 
                  src={user?.profilePicture}
                  alt={user?.fullName}
                  sx={{ 
                    width: '95%', 
                    height: '95%',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '40%',
              height: 4,
              bgcolor: 'primary.main',
              borderRadius: 2
            }
          }}
        >
          Booking Statistics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#FFF8E1',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  right: -15,
                  bottom: -15,
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 193, 7, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PendingActionsIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ fontWeight: 700, color: 'warning.dark', mb: 1 }}
              >
                {bookings.filter(b => b.status === 'pending').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pending Requests
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#EDE7F6',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  right: -15,
                  bottom: -15,
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  bgcolor: 'rgba(123, 31, 162, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ fontWeight: 700, color: '#6a1b9a', mb: 1 }}
              >
                {bookings.filter(b => b.status === 'confirmed').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Confirmed Bookings
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#E8EAF6',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  right: -15,
                  bottom: -15,
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  bgcolor: 'rgba(48, 63, 159, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AssignmentIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ fontWeight: 700, color: '#3f51b5', mb: 1 }}
              >
                {bookings.filter(b => b.status === 'completed').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completed Bookings
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#FFEBEE',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  right: -15,
                  bottom: -15,
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ fontWeight: 700, color: 'error.dark', mb: 1 }}
              >
                {bookings.filter(b => b.status === 'cancelled').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Declined Bookings
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Booking Management Tabs */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '40%',
              height: 4,
              bgcolor: 'primary.main',
              borderRadius: 2
            }
          }}
        >
          Booking Management
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 600,
                py: 2,
                transition: 'all 0.2s',
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' },
                minHeight: { xs: '48px', md: '56px' },
                color: 'text.secondary',
              },
              '& .Mui-selected': {
                color: 'primary.main',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3,
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: tabValue === 0 ? 'primary.lighter' : 'transparent',
                      color: tabValue === 0 ? 'primary.main' : 'inherit',
                      borderRadius: '50%',
                      width: { xs: 24, md: 28 },
                      height: { xs: 24, md: 28 },
                      mr: 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {bookings.filter(booking => booking.status === 'pending').length}
                  </Box>
                  <span>Pending</span>
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: tabValue === 1 ? 'primary.lighter' : 'transparent',
                      color: tabValue === 1 ? 'primary.main' : 'inherit',
                      borderRadius: '50%',
                      width: { xs: 24, md: 28 },
                      height: { xs: 24, md: 28 },
                      mr: 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {bookings.filter(booking => booking.status === 'confirmed').length}
                  </Box>
                  <span>Confirmed</span>
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: tabValue === 2 ? 'primary.lighter' : 'transparent',
                      color: tabValue === 2 ? 'primary.main' : 'inherit',
                      borderRadius: '50%',
                      width: { xs: 24, md: 28 },
                      height: { xs: 24, md: 28 },
                      mr: 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {bookings.filter(booking => booking.status === 'completed').length}
                  </Box>
                  <span>Completed</span>
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: tabValue === 3 ? 'primary.lighter' : 'transparent',
                      color: tabValue === 3 ? 'primary.main' : 'inherit',
                      borderRadius: '50%',
                      width: { xs: 24, md: 28 },
                      height: { xs: 24, md: 28 },
                      mr: 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {bookings.filter(booking => booking.status === 'cancelled').length}
                  </Box>
                  <span>Declined</span>
                </Box>
              } 
            />
        </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Box>
          ) : (
            <>
        <TabPanel value={tabValue} index={0}>
                {renderBookingsList('pending')}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
                {renderBookingsList('confirmed')}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
                {renderBookingsList('completed')}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
                {renderBookingsList('cancelled')}
        </TabPanel>
            </>
          )}
      </Paper>
      </Box>

      {/* Response Dialog */}
      <Dialog 
        open={responseDialogOpen} 
        onClose={() => setResponseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          color: responseAction === 'accept' ? '#7C4DFF' : 'error.main',
          pb: 1
        }}>
          {responseAction === 'accept' ? 'Accept Booking Request' : 'Decline Booking Request'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="body1" 
              component="p" 
              sx={{ mb: 3, color: 'text.secondary' }}
            >
            {responseAction === 'accept'
                ? 'You are about to accept this booking request. Once accepted, the parent will be notified, and the booking will be confirmed.' 
              : 'You are about to decline this booking request. Please provide a reason for declining.'}
            </Typography>
          </Box>
          
          {responseAction === 'decline' && (
          <TextField
            autoFocus
            multiline
              rows={4}
              variant="outlined"
              label="Reason for declining"
              fullWidth
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setResponseDialogOpen(false)}
            variant="outlined"
            sx={{ 
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResponseConfirm} 
            variant="contained"
            color={responseAction === 'accept' ? 'primary' : 'error'}
            sx={{ 
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              ...(responseAction === 'accept' && {
                bgcolor: '#7C4DFF',
                '&:hover': { bgcolor: '#5E35B1' }
              })
            }}
            startIcon={responseAction === 'accept' ? <CheckIcon /> : <CloseIcon />}
          >
            {responseAction === 'accept' ? 'Confirm Accept' : 'Confirm Decline'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Booking Dialog */}
      <Dialog 
        open={completeDialogOpen} 
        onClose={() => setCompleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          color: 'primary.main',
          pb: 1
        }}>
          Complete Booking
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="body1" 
              component="p" 
              sx={{ mb: 3, color: 'text.secondary' }}
            >
              You are about to mark this booking as complete. Please provide any additional notes about this booking session:
            </Typography>
          </Box>
          
          <TextField
            autoFocus
            multiline
            rows={4}
            variant="outlined"
            label="Completion Notes (optional)"
            fullWidth
            value={completeNotes}
            onChange={(e) => setCompleteNotes(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setCompleteDialogOpen(false)}
            variant="outlined"
            sx={{ 
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteConfirm}
            variant="contained"
            sx={{ 
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#7b1fa2',
              '&:hover': { bgcolor: '#6a1b9a' }
            }}
            startIcon={<DoneAllIcon />}
          >
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Booking Details Dialog */}
      <Dialog
        open={viewDetailDialogOpen}
        onClose={() => setViewDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          color: 'primary.main',
          pb: 1
        }}>
          Booking Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={selectedBooking.parent?.profilePicture || selectedBooking.parentId?.profilePicture}
                    alt={(selectedBooking.parent?.firstName && selectedBooking.parent?.lastName) ? 
                         `${selectedBooking.parent.firstName} ${selectedBooking.parent.lastName}` : 
                         selectedBooking.parentId?.name || "Parent"}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {(selectedBooking.parent?.firstName && selectedBooking.parent?.lastName) ? 
                     `${selectedBooking.parent.firstName} ${selectedBooking.parent.lastName}` : 
                     selectedBooking.parent?.fullName || selectedBooking.parentId?.name || "Parent"}
                  </Typography>
                  <Chip 
                    label={selectedBooking.status}
                    color={
                      selectedBooking.status === 'pending' ? 'warning' :
                      selectedBooking.status === 'confirmed' ? 'primary' :
                      selectedBooking.status === 'completed' ? 'secondary' : 'error'
                    }
                    sx={{ 
                      mt: 1,
                      ...(selectedBooking.status === 'confirmed' && {
                        bgcolor: '#7C4DFF',
                        color: 'white'
                      }),
                      ...(selectedBooking.status === 'completed' && {
                        bgcolor: '#3F51B5',
                        color: 'white'
                      })
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Booking Information
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarMonthIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {new Date(selectedBooking.startTime).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {new Date(selectedBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(selectedBooking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {selectedBooking.location?.address || 'No address provided'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ChildCareIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {selectedBooking.childrenCount || selectedBooking.numberOfChildren || '1'} 
                            {(selectedBooking.childrenCount === 1 || selectedBooking.numberOfChildren === 1) ? ' child' : ' children'}
                            {selectedBooking.childrenAges && selectedBooking.childrenAges.length > 0 && ` (Ages: ${selectedBooking.childrenAges.join(', ')})`}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <PaymentIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem', mt: 0.3 }} />
                          <Box>
                            <Typography variant="body1" fontWeight="medium" color="#7C4DFF">
                              Total: ${selectedBooking.totalPrice || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedBooking.serviceType === 'part-time' ? 'Part-time Care' : 'Full-time Care'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Notes
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                    <Typography variant="body2">
                      {selectedBooking.notes || selectedBooking.specialRequests || "No additional notes provided."}
                    </Typography>
                  </Paper>
                </Box>
                
                {selectedBooking.nannyMessage && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Your Message
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                      <Typography variant="body2">
                        {selectedBooking.nannyMessage}
                      </Typography>
                    </Paper>
                  </Box>
                )}
                
                {selectedBooking.completionNotes && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Completion Notes
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                      <Typography variant="body2">
                        {selectedBooking.completionNotes}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setViewDetailDialogOpen(false)}
            variant="contained"
            color="primary"
            sx={{ 
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const BookingsList = ({ bookings, onResponseClick, onCompleteClick, emptyMessage }) => {
  if (bookings.length === 0) {
    return (
      <Alert 
        severity="info" 
        sx={{ 
          mt: 2, 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          py: 2
        }}
      >
        {emptyMessage}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {bookings.map((booking) => (
        <Grid item xs={12} key={booking._id}>
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ pb: 0 }}>
              <Grid container spacing={2}>
                {/* Parent Info */}
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      src={booking.parentId?.profileImage}
                      alt={booking.parentId?.name}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 1,
                        boxShadow: 2
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" align="center">
                      {booking.parentId?.name}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                        <PhoneIcon sx={{ color: 'primary.main', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {booking.parentId?.phone || 'No phone provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EmailIcon sx={{ color: 'primary.main', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {booking.parentId?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Booking Details */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {booking.location.address}, {booking.location.city}, {booking.location.state} {booking.location.zipCode}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ChildCareIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {booking.numberOfChildren} {booking.numberOfChildren === 1 ? 'child' : 'children'} (Ages: {booking.childrenAges.join(', ')})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      Service Type: {booking.serviceType === 'part-time' ? 'Part-time Care' : 'Full-time Care'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1" fontWeight="bold" sx={{ color: '#7C4DFF' }}>
                      Total: ${booking.totalPrice}
                    </Typography>
                  </Box>
                </Grid>

                {/* Status and Actions */}
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'space-between' }}>
                    <StatusChip
                      label={booking.status.toUpperCase()}
                      status={booking.status}
                      sx={{ fontWeight: 'bold', px: 1 }}
                    />
                    {booking.cancellationReason && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                        Reason: {booking.cancellationReason}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {booking.specialRequests && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Special Requests:
                  </Typography>
                  <Typography variant="body2">{booking.specialRequests}</Typography>
                </Box>
              )}

              {booking.nannyMessage && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Your Message:
                  </Typography>
                  <Typography variant="body2">{booking.nannyMessage}</Typography>
                </Box>
              )}

              {booking.completionNotes && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    Completion Notes:
                  </Typography>
                  <Typography variant="body2">{booking.completionNotes}</Typography>
                </Box>
              )}
            </CardContent>

            <Divider />

            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              {/* Show different actions based on booking status */}
              {booking.status === 'pending' && (
                <>
                  <Button
                    size="medium"
                    color="error"
                    variant="outlined"
                    onClick={() => onResponseClick(booking._id, 'decline')}
                    sx={{ mr: 1, borderRadius: 2 }}
                  >
                    Decline
                  </Button>
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={() => onResponseClick(booking._id, 'accept')}
                    sx={{ borderRadius: 2 }}
                  >
                    Accept
                  </Button>
                </>
              )}

              {booking.status === 'confirmed' && (
                <Button
                  size="medium"
                  color="primary"
                  variant="contained"
                  onClick={() => onCompleteClick(booking._id)}
                  sx={{ borderRadius: 2, bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
                >
                  Mark as Completed
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default NannyDashboard;
