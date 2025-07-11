import {
    Delete as DeleteIcon,
    Event as EventIcon,
    Person as PersonIcon,
    Refresh as RefreshIcon,
    Work as WorkIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [nannies, setNannies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '',
    id: null,
    name: ''
  });
  const [refreshMessage, setRefreshMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshMessage('');

      // Add token to headers manually in case interceptors aren't working
      const token = user?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      console.log('Admin Dashboard: Attempting to fetch data with token:', token ? 'Token exists' : 'No token');
      
      // Fetch data with individual try/catch blocks to continue if one request fails
      let statsData, usersData, nanniesData, bookingsData;
      
      try {
        const statsRes = await axios.get('/api/admin/stats', config);
        statsData = statsRes.data;
        console.log('Admin Dashboard: Stats data fetched successfully');
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
      
      try {
        const usersRes = await axios.get('/api/admin/users', config);
        usersData = usersRes.data;
        console.log('Admin Dashboard: Users data fetched successfully');
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
      
      try {
        const nanniesRes = await axios.get('/api/admin/nannies', config);
        nanniesData = nanniesRes.data;
        console.log('Admin Dashboard: Nannies data fetched successfully');
      } catch (err) {
        console.error('Failed to fetch nannies:', err);
      }
      
      try {
        const bookingsRes = await axios.get('/api/admin/bookings', config);
        bookingsData = bookingsRes.data;
        console.log('Admin Dashboard: Bookings data fetched successfully');
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }

      if (statsData) setStats(statsData);
      if (usersData) setUsers(usersData);
      if (nanniesData) setNannies(nanniesData);
      if (bookingsData) setBookings(bookingsData);
      
      // Set error if none of the requests succeeded
      if (!statsData && !usersData && !nanniesData && !bookingsData) {
        setError('Could not fetch any data. Please check your network connection and login status.');
      } else {
        setRefreshMessage('Data refreshed successfully!');
        setTimeout(() => setRefreshMessage(''), 3000); // Clear message after 3 seconds
      }
      
    } catch (error) {
      console.error('Error fetching admin data:', error.response || error);
      setError(error.response?.data?.error || 'Failed to fetch data. Please check your connection and permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = user?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (deleteDialog.type === 'user') {
        await axios.delete(`/api/admin/users/${deleteDialog.id}`, config);
        setUsers(users.filter(user => user._id !== deleteDialog.id));
      } else if (deleteDialog.type === 'nanny') {
        await axios.delete(`/api/admin/nannies/${deleteDialog.id}`, config);
        setNannies(nannies.filter(nanny => nanny._id !== deleteDialog.id));
      }

      setDeleteDialog({ open: false, type: '', id: null, name: '' });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h4">{stats?.userStats.total || 0}</Typography>
              <Typography color="textSecondary">
                Parents: {stats?.userStats.parents || 0} | Nannies: {stats?.userStats.nannies || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WorkIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Nanny Profiles</Typography>
              </Box>
              <Typography variant="h4">{stats?.nannyProfiles || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EventIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h4">{stats?.bookings || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Users" />
          <Tab label="Nannies" />
          <Tab label="Bookings" />
        </Tabs>
      </Box>

      {/* Users Tab */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'user',
                          id: user._id,
                          name: user.name
                        })}
                        disabled={user.role === 'admin'} // Disable deleting admins
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No users found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Nannies Tab */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Hourly Rate</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nannies.length > 0 ? (
                nannies.map((nanny) => (
                  <TableRow key={nanny._id}>
                    <TableCell>{nanny.userId?.name || 'N/A'}</TableCell>
                    <TableCell>{nanny.userId?.email || 'N/A'}</TableCell>
                    <TableCell>{nanny.experience} years</TableCell>
                    <TableCell>₹{nanny.hourlyRate}/hr</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'nanny',
                          id: nanny._id,
                          name: nanny.userId?.name || 'Nanny'
                        })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No nanny profiles found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Bookings Tab */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parent</TableCell>
                <TableCell>Nanny</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  // Get a properly formatted date
                  const bookingDate = booking.date && !isNaN(new Date(booking.date).getTime()) 
                    ? new Date(booking.date).toLocaleDateString()
                    : 'No date specified';
                  
                  return (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.parentId?.name || 'Unknown Parent'}</TableCell>
                      <TableCell>{booking.nannyId?.name || 'Unknown Nanny'}</TableCell>
                      <TableCell>{bookingDate}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'medium',
                            display: 'inline-block',
                            bgcolor: booking.status === 'completed'
                              ? 'success.100'
                              : booking.status === 'cancelled'
                              ? 'error.100'
                              : booking.status === 'pending'
                              ? 'warning.100'
                              : booking.status === 'confirmed'
                              ? 'info.100'
                              : 'grey.100',
                            color: booking.status === 'completed'
                              ? 'success.800'
                              : booking.status === 'cancelled'
                              ? 'error.800'
                              : booking.status === 'pending'
                              ? 'warning.800'
                              : booking.status === 'confirmed'
                              ? 'info.800'
                              : 'grey.800',
                          }}
                        >
                          {booking.status || 'Unknown'}
                        </Box>
                      </TableCell>
                      <TableCell>₹{booking.totalPrice || 0}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No bookings found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.type === 'user' ? 'user' : 'nanny'} {deleteDialog.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', id: null, name: '' })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refresh Button */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Refresh Message */}
      {refreshMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {refreshMessage}
        </Alert>
      )}
    </Container>
  );
};

export default AdminDashboard; 