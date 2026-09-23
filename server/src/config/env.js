const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file if available
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || 'buyer_discovery',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  jwtSecret: process.env.JWT_SECRET || 'buyer_discovery_portal_fallback_jwt_secret_key_2026',
  serpApiKey: process.env.SERPAPI_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || ''
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
