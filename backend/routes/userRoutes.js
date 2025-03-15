const express = require('express');
const { loginUser, signupUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Login and signup routes - public
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/register', signupUser);

// Protected routes
router.use(requireAuth);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;
