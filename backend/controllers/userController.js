const User = require('../models/userModel');
const Nanny = require('../models/nannyModel');
const jwt = require('jsonwebtoken');

// Create token function
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);

    res.status(200).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      token 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup user
const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.signup(name, email, password, role);

    // Create a token
    const token = createToken(user._id);

    // If the user is a nanny, automatically create a basic nanny profile
    if (role === 'nanny') {
      try {
        const nannyProfile = await Nanny.create({
          userId: user._id,
          bio: `Hi, I'm ${name}! I'm a nanny looking to provide childcare services.`,
          experience: 1, // Default values
          hourlyRate: 15,
          skills: ['Babysitting'],
          languages: ['English'],
          education: 'Not specified',
          specialNeeds: false,
          ageGroupsServed: ['Infant', 'Toddler', 'Preschool'],
          servicesOffered: ['Babysitting', 'Part-time care'],
          certifications: [],
          availability: [],
          gallery: [],
          reviews: []
        });

        console.log('Created nanny profile:', nannyProfile);
      } catch (error) {
        console.error('Error creating nanny profile:', error);
        // Continue with user creation even if nanny profile creation fails
      }
    }

    res.status(200).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      token 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;
    
    // Log the received data for debugging
    console.log('Updating user profile:', {
      userId: req.user._id,
      receivedData: { name, phone, hasAddress: !!address, profileImage: !!profileImage },
      addressDetails: address ? { 
        hasStreet: !!address.street, 
        hasCity: !!address.city, 
        hasState: !!address.state, 
        hasZipCode: !!address.zipCode 
      } : null
    });
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (profileImage) user.profileImage = profileImage;
    
    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getUserProfile,
  updateUserProfile
};
