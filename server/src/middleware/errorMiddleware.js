const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`[ERROR] ${req.method} ${req.originalUrl}: ${err.message}`);

  // Multer File Size or Type Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds maximum allowed limit of 10 MB',
      errorCode: 'FILE_TOO_LARGE'
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorCode: err.errorCode || 'SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
