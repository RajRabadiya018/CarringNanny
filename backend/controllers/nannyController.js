const Nanny = require('../models/nannyModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');

// Get all nannies with filtering
const getNannies = async (req, res) => {
  try {
    const {
      minRate,
      maxRate,
      minExperience,
      skills,
      languages,
      specialNeeds,
      ageGroups,
      services,
      minRating,
      availability
    } = req.query;

    console.log('Received filter query params:', req.query);

    // Build filter object
    const filter = {};

    // Only add filters if they are explicitly provided in the query
    if (minRate !== undefined) filter.hourlyRate = { ...(filter.hourlyRate || {}), $gte: Number(minRate) };
    if (maxRate !== undefined) filter.hourlyRate = { ...(filter.hourlyRate || {}), $lte: Number(maxRate) };
    if (minExperience !== undefined) filter.experience = { $gte: Number(minExperience) };
    if (specialNeeds === 'true') filter.specialNeeds = true;
    if (minRating !== undefined) filter.averageRating = { $gte: Number(minRating) };

    if (skills && skills.trim() !== '') {
      const skillsArray = skills.split(',');
      filter.skills = { $in: skillsArray };
    }

    if (languages && languages.trim() !== '') {
      const languagesArray = languages.split(',');
      filter.languages = { $in: languagesArray };
    }

    if (ageGroups && ageGroups.trim() !== '') {
      const ageGroupsArray = ageGroups.split(',');
      filter.ageGroupsServed = { $in: ageGroupsArray };
    }

    if (services && services.trim() !== '') {
      const servicesArray = services.split(',');
      filter.servicesOffered = { $in: servicesArray };
    }

    // Handle availability filtering if provided
    if (availability && availability.trim() !== '') {
      try {
        const [day, startTime, endTime] = availability.split(',');
        filter['availability.day'] = day;

        if (startTime) {
          filter['availability.startTime'] = { $lte: startTime };
        }

        if (endTime) {
          filter['availability.endTime'] = { $gte: endTime };
        }
      } catch (err) {
        console.error('Error parsing availability filter:', err);
      }
    }

    console.log('Applying nanny search filters:', JSON.stringify(filter, null, 2));

    // Find nannies with filters and populate user info
    const nannies = await Nanny.find(filter)
      .populate('userId', 'name email profileImage phone address')
      .sort({ createdAt: -1 });

    console.log(`Found ${nannies.length} nannies matching the criteria`);
    res.status(200).json(nannies);
  } catch (error) {
    console.error('Error in getNannies:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get a single nanny
const getNanny = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nanny' });
  }

  const nanny = await Nanny.findById(id).populate('userId', 'name email profileImage phone address');

  if (!nanny) {
    return res.status(404).json({ error: 'No such nanny' });
  }

  // Log the nanny data being returned
  console.log('Nanny data being returned:', {
    id: nanny._id,
    userId: nanny.userId?._id,
    userName: nanny.userId?.name,
    userPhone: nanny.userId?.phone,
    userHasAddress: !!nanny.userId?.address,
    nannyPhone: nanny.phoneNumber,
    nannyLocation: nanny.location,
    // Check if the fields are actually present
    hasPhoneNumberField: 'phoneNumber' in nanny,
    hasLocationField: 'location' in nanny,
  });

  // If user has phone but nanny doesn't, copy it over
  if (nanny.userId?.phone && !nanny.phoneNumber) {
    console.log('Copying phone from user profile to nanny profile');
    nanny.phoneNumber = nanny.userId.phone;
    await nanny.save();
  }

  // If user has address but nanny doesn't have location, format and copy it
  if (nanny.userId?.address && !nanny.location) {
    const address = nanny.userId.address;
    const formattedAddress = typeof address === 'string'
      ? address
      : `${address.street || ''}${address.city ? ', ' + address.city : ''}${address.state ? ', ' + address.state : ''}${address.zipCode ? ' ' + address.zipCode : ''}`;

    if (formattedAddress.trim()) {
      console.log('Copying address from user profile to nanny profile');
      nanny.location = formattedAddress;
      await nanny.save();
    }
  }

  res.status(200).json(nanny);
};

// Create a nanny profile
const createNanny = async (req, res) => {
  try {
    // Check if user already has a nanny profile
    const existingNanny = await Nanny.findOne({ userId: req.user._id });

    if (existingNanny) {
      return res.status(400).json({ error: 'You already have a nanny profile' });
    }

    // Update user role to nanny if it's not already
    const user = await User.findById(req.user._id);
    if (user.role !== 'nanny') {
      user.role = 'nanny';
      await user.save();
    }

    // Create nanny profile
    const {
      bio,
      experience,
      hourlyRate,
      skills,
      languages,
      education,
      certifications,
      availability,
      gallery,
      specialNeeds,
      ageGroupsServed,
      servicesOffered,
      phoneNumber,
      location
    } = req.body;

    // Format address from user profile if not provided
    let formattedLocation = location;
    if (!formattedLocation && user.address) {
      const address = user.address;
      formattedLocation = typeof address === 'string'
        ? address
        : `${address.street || ''}${address.city ? ', ' + address.city : ''}${address.state ? ', ' + address.state : ''}${address.zipCode ? ' ' + address.zipCode : ''}`;
    }

    // Use user phone if not provided
    const nannyPhone = phoneNumber || user.phone || '';

    console.log('Creating new nanny profile with contact info:', {
      phone: nannyPhone,
      location: formattedLocation
    });

    const nanny = await Nanny.create({
      userId: req.user._id,
      bio: bio || `Hi, I'm ${user.name}! I'm a nanny looking to provide childcare services.`,
      experience: experience || 1,
      hourlyRate: hourlyRate || 15,
      skills: skills || ['Babysitting'],
      languages: languages || ['English'],
      education: education || 'Not specified',
      certifications: certifications || [],
      availability: availability || [],
      gallery: gallery || [],
      specialNeeds: specialNeeds || false,
      ageGroupsServed: ageGroupsServed || ['Infant', 'Toddler', 'Preschool'],
      servicesOffered: servicesOffered || ['Babysitting', 'Part-time care'],
      phoneNumber: nannyPhone,
      location: formattedLocation
    });

    res.status(201).json(nanny);
  } catch (error) {
    console.error('Error creating nanny profile:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update a nanny profile
const updateNanny = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such nanny' });
  }

  // Find nanny and check if it belongs to the logged-in user
  const nanny = await Nanny.findById(id);

  if (!nanny) {
    return res.status(404).json({ error: 'No such nanny' });
  }

  if (nanny.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  // Log the received update data for debugging
  console.log('Updating nanny profile:', {
    id,
    receivedData: req.body,
    hasPhoneNumber: 'phoneNumber' in req.body,
    hasLocation: 'location' in req.body
  });

  // Create update object with explicit handling for location and phoneNumber
  const updateData = { ...req.body };

  // Explicitly check and set phoneNumber and location fields
  if ('phoneNumber' in req.body) {
    console.log(`Setting phoneNumber to: ${req.body.phoneNumber}`);
    updateData.phoneNumber = req.body.phoneNumber;
  }

  if ('location' in req.body) {
    console.log(`Setting location to: ${req.body.location}`);
    updateData.location = req.body.location;
  }

  // Update the nanny profile
  const updatedNanny = await Nanny.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  // Log the updated nanny data
  console.log('Nanny profile after update:', {
    id: updatedNanny._id,
    phoneNumber: updatedNanny.phoneNumber,
    location: updatedNanny.location
  });

  res.status(200).json(updatedNanny);
};

// Add a review to a nanny
const addNannyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such nanny' });
    }

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Please provide rating and comment' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Find nanny
    const nanny = await Nanny.findById(id);

    if (!nanny) {
      return res.status(404).json({ error: 'No such nanny' });
    }

    // Only parents can review nannies
    const user = await User.findById(req.user._id);
    if (user.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can review nannies' });
    }

    // Check if user has already reviewed this nanny
    const existingReview = nanny.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this nanny' });
    }

    // Check if the parent has completed bookings with this nanny
    const completedBookings = await Booking.find({
      parentId: req.user._id,
      nannyId: id,
      status: 'completed'
    });

    // Create the review object
    const newReview = {
      userId: req.user._id,
      rating,
      comment,
      createdAt: new Date(),
      verified: completedBookings.length > 0 // Mark as verified if there are completed bookings
    };

    // Add review
    nanny.reviews.push(newReview);

    // Update average rating
    const totalRating = nanny.reviews.reduce((sum, review) => sum + review.rating, 0);
    nanny.averageRating = totalRating / nanny.reviews.length;

    await nanny.save({ validateModifiedOnly: true });

    res.status(200).json({
      message: 'Review added successfully',
      review: newReview,
      averageRating: nanny.averageRating
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get current user's nanny profile
const getCurrentNannyProfile = async (req, res) => {
  try {
    const nanny = await Nanny.findOne({ userId: req.user._id })
      .populate('userId', 'name email profileImage phone address');

    if (!nanny) {
      return res.status(404).json({ error: 'You do not have a nanny profile yet' });
    }

    // Log the nanny data being returned
    console.log('Current nanny profile data:', {
      id: nanny._id,
      userId: nanny.userId?._id,
      userName: nanny.userId?.name,
      userPhone: nanny.userId?.phone,
      userHasAddress: !!nanny.userId?.address,
      nannyPhone: nanny.phoneNumber,
      nannyLocation: nanny.location,
      // Check if the fields are actually present
      hasPhoneNumberField: 'phoneNumber' in nanny,
      hasLocationField: 'location' in nanny,
    });

    // If user has phone but nanny doesn't, copy it over
    if (nanny.userId?.phone && !nanny.phoneNumber) {
      console.log('Copying phone from user profile to nanny profile');
      nanny.phoneNumber = nanny.userId.phone;
      await nanny.save();
    }

    // If user has address but nanny doesn't have location, format and copy it
    if (nanny.userId?.address && !nanny.location) {
      const address = nanny.userId.address;
      const formattedAddress = typeof address === 'string'
        ? address
        : `${address.street || ''}${address.city ? ', ' + address.city : ''}${address.state ? ', ' + address.state : ''}${address.zipCode ? ' ' + address.zipCode : ''}`;

      if (formattedAddress.trim()) {
        console.log('Copying address from user profile to nanny profile');
        nanny.location = formattedAddress;
        await nanny.save();
      }
    }

    res.status(200).json(nanny);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reviews for a nanny
const getNannyReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such nanny' });
    }

    // Find nanny
    const nanny = await Nanny.findById(id);

    if (!nanny) {
      return res.status(404).json({ error: 'No such nanny' });
    }

    // Populate user details for each review
    const populatedNanny = await Nanny.findById(id).populate({
      path: 'reviews.userId',
      select: 'name profileImage'
    });

    // Format reviews with user details
    const formattedReviews = populatedNanny.reviews.map(review => {
      return {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        verified: review.verified,
        createdAt: review.createdAt,
        user: review.userId
      };
    });

    // Sort reviews by date (newest first)
    formattedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(formattedReviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getNannies,
  getNanny,
  createNanny,
  updateNanny,
  addNannyReview,
  getNannyReviews,
  getCurrentNannyProfile
};
