const express = require('express');
const { 
  getNannies, 
  getNanny, 
  createNanny, 
  updateNanny, 
  addNannyReview,
  getNannyReviews,
  getCurrentNannyProfile 
} = require('../controllers/nannyController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public routes
router.get('/', getNannies);

// Some protected routes that need to be before the /:id routes
router.use(requireAuth);
router.get('/profile/me', getCurrentNannyProfile);

// Public routes with params
router.get('/:id', getNanny);
router.get('/:id/reviews', getNannyReviews);

// Other protected routes
router.post('/', createNanny);
router.put('/:id', updateNanny);
router.post('/:id/reviews', addNannyReview);

module.exports = router;
