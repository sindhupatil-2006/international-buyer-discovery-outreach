const express = require('express');
const router = express.Router();
const { isInMemoryFallback } = require('../config/database');

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'International Buyer Discovery & Outreach API',
    version: '1.0.0',
    dbMode: isInMemoryFallback() ? 'fallback_data_engine' : 'mysql_connected'
  });
});

module.exports = router;
