const { body, validationResult } = require('express-validator');

// Validation helper middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('companyName').optional().trim(),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const searchValidation = [
  body('niche').trim().notEmpty().withMessage('Target buyer niche is required'),
  body('country').trim().notEmpty().withMessage('Target country is required'),
  body('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  validate
];

const sendOutreachValidation = [
  body('recipientEmail').trim().isEmail().withMessage('Valid recipient buyer email is required'),
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('subject').trim().notEmpty().withMessage('Email subject line is required'),
  body('body').trim().notEmpty().withMessage('Email body content is required'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  searchValidation,
  sendOutreachValidation
};
