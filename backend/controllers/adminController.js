const User = require('../models/userModel');
const Nanny = require('../models/nannyModel');
const Booking = require('../models/bookingModel');
const mongoose = require('mongoose');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // First check if this is a nanny and delete their nanny profile if exists
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'nanny') {
      await Nanny.deleteOne({ userId: id });
    }
    
    // Delete any bookings associated with this user
    if (user.role === 'parent') {
      await Booking.deleteMany({ parentId: id });
    } else if (user.role === 'nanny') {
      await Booking.deleteMany({ nannyId: id });
    }
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all nannies with their profiles
const getAllNannies = async (req, res) => {
  try {
    const nannyProfiles = await Nanny.find({})
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(nannyProfiles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete nanny profile (but not user account)
const deleteNanny = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid nanny ID' });
  }

  try {
    const nanny = await Nanny.findById(id);
    
    if (!nanny) {
      return res.status(404).json({ error: 'Nanny profile not found' });
    }

    // Delete any bookings associated with this nanny
    await Booking.deleteMany({ nannyId: nanny.userId });
    
    // Delete the nanny profile
    await Nanny.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Nanny profile deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    // Find bookings and populate both parent and nanny fields
    // Note the reference is to User model for both parentId and nannyId
    const bookings = await Booking.find({})
      .populate({
        path: 'parentId',
        select: 'name email role',
        model: 'User'
      })
      .populate({
        path: 'nannyId',
        select: 'name email role',
        model: 'User'
      })
      .sort({ createdAt: -1 });
    
    // Format the bookings to ensure all fields are properly populated
    const formattedBookings = bookings.map(booking => {
      return {
        _id: booking._id,
        parentId: booking.parentId || { name: 'Unknown Parent', email: 'unknown' },
        nannyId: booking.nannyId || { name: 'Unknown Nanny', email: 'unknown' },
        date: booking.date || new Date(),
        startTime: booking.startTime || new Date(),
        endTime: booking.endTime || new Date(),
        status: booking.status || 'unknown',
        totalPrice: booking.totalPrice || 0,
        serviceType: booking.serviceType || 'babysitting',
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      };
    });
    
    console.log('Admin bookings retrieved:', formattedBookings.length);
    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalParents = await User.countDocuments({ role: 'parent' });
    const totalNannies = await User.countDocuments({ role: 'nanny' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    const totalNannyProfiles = await Nanny.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Get recent users
    const recentUsers = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent bookings
    const recentBookings = await Booking.find({})
      .populate('parentId', 'name')
      .populate('nannyId', 'name')
      .select('status date createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      userStats: {
        total: totalUsers,
        parents: totalParents,
        nannies: totalNannies,
        admins: totalAdmins
      },
      nannyProfiles: totalNannyProfiles,
      bookings: totalBookings,
      recentUsers,
      recentBookings
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllNannies,
  deleteNanny,
  getAllBookings,
  getAdminStats
}; 