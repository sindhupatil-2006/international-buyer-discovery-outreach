const express = require('express');
const router = express.Router();
const outreachController = require('../controllers/outreachController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { sendOutreachValidation } = require('../utils/validators');
const rateLimit = require('express-rate-limit');

// Strict rate limit on email sending (30 emails per 15 minutes)
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Rate limit exceeded: Maximum outreach emails reached for this period.'
  }
});

router.post('/send', protect, emailLimiter, upload.single('attachment'), sendOutreachValidation, outreachController.sendEmail);
router.post('/generate', protect, outreachController.generatePitch);
router.get('/', protect, outreachController.getOutreachHistory);
router.get('/:id', protect, outreachController.getOutreachById);
router.delete('/:id', protect, outreachController.deleteOutreach);

module.exports = router;
