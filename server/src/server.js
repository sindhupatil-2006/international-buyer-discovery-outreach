const app = require('./app');
const env = require('./config/env');
const { initDb } = require('./config/database');
const logger = require('./utils/logger');

const PORT = env.port;

async function startServer() {
  // Initialize Database connection
  await initDb();

  app.listen(PORT, () => {
    logger.info(`=======================================================`);
    logger.info(`  International Buyer Discovery & Outreach API Server`);
    logger.info(`  Running on http://localhost:${PORT}`);
    logger.info(`  Health Endpoint: http://localhost:${PORT}/api/health`);
    logger.info(`=======================================================`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
