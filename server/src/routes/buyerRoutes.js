const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const { protect } = require('../middleware/authMiddleware');
const { searchValidation } = require('../utils/validators');
const rateLimit = require('express-rate-limit');

// Per-user rate limiting on search endpoint (20 requests per 15 mins)
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many search requests. Please wait a few minutes before discovering more buyers.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
});

// Step 14: API status endpoint
router.get('/api-status', protect, buyerController.getApiStatus);

router.post('/search', protect, searchLimiter, searchValidation, buyerController.search);
router.get('/', protect, buyerController.getBuyers);
router.get('/:id', protect, buyerController.getBuyerById);
router.delete('/:id', protect, buyerController.deleteBuyer);

module.exports = router;
