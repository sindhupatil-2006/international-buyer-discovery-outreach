const db = require('../config/database');
const Buyer = require('../models/Buyer');
const Outreach = require('../models/Outreach');
const Search = require('../models/Search');

// @desc    Get aggregate stats and recent activity for Dashboard
// @route   GET /api/dashboard/stats
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Direct Database aggregation query
    const statsSql = `
      SELECT
        (SELECT COUNT(*) FROM buyers WHERE user_id = ?) AS totalBuyers,
        (SELECT COUNT(*) FROM outreach WHERE user_id = ?) AS totalOutreach,
        (SELECT COUNT(*) FROM outreach WHERE user_id = ? AND DATE(sent_at) = CURRENT_DATE()) AS sentToday,
        (SELECT COUNT(*) FROM searches WHERE user_id = ?) AS totalSearches,
        (SELECT COUNT(*) FROM outreach WHERE user_id = ? AND status = 'Sent') AS successfulOutreach,
        (SELECT COUNT(*) FROM outreach WHERE user_id = ? AND status = 'Failed') AS failedOutreach
    `;

    const [rows] = await db.query(statsSql, [userId, userId, userId, userId, userId, userId]);
    const rawStats = rows[0] || {
      totalBuyers: 0,
      totalOutreach: 0,
      sentToday: 0,
      totalSearches: 0,
      successfulOutreach: 0,
      failedOutreach: 0
    };

    // Get recent buyers (limit 5)
    const allBuyers = await Buyer.findByUserId(userId);
    const recentBuyers = allBuyers.slice(0, 5);

    // Get recent outreach history (limit 5)
    const allOutreach = await Outreach.findByUserId(userId);
    const recentOutreach = allOutreach.slice(0, 5);

    // Get recent search queries
    const recentSearches = await Search.findByUserId(userId);

    res.json({
      success: true,
      stats: {
        totalBuyers: parseInt(rawStats.totalBuyers || 0, 10),
        totalOutreach: parseInt(rawStats.totalOutreach || 0, 10),
        sentToday: parseInt(rawStats.sentToday || 0, 10),
        totalSearches: parseInt(rawStats.totalSearches || 0, 10),
        successfulOutreach: parseInt(rawStats.successfulOutreach || 0, 10),
        failedOutreach: parseInt(rawStats.failedOutreach || 0, 10)
      },
      recentBuyers,
      recentOutreach,
      recentSearches: recentSearches.slice(0, 5)
    });
  } catch (err) {
    next(err);
  }
};
