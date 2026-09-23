const Buyer = require('../models/Buyer');
const Search = require('../models/Search');
const { searchBuyers } = require('../services/buyerSearchService');
const logger = require('../utils/logger');

// @desc    Discover International Buyers via Search API
// @route   POST /api/buyers/search
exports.search = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { niche, country, limit = 10 } = req.body;

    logger.info(`User ${userId} requested buyer discovery: Niche="${niche}", Country="${country}"`);

    const result = await searchBuyers({
      userId,
      niche,
      country,
      limit: parseInt(limit, 10)
    });

    const discoveredBuyers = result.buyers || [];

    // Save search attempt in history
    await Search.create({
      userId,
      niche,
      country,
      resultsCount: discoveredBuyers.length
    });

    // Save discovered buyers into database
    const savedBuyers = [];
    for (const b of discoveredBuyers) {
      try {
        const id = await Buyer.create({
          userId,
          companyName: b.companyName,
          email: b.email,
          website: b.website,
          country: b.country,
          description: b.description,
          industry: b.industry,
          sourceUrl: b.sourceUrl,
          emailVerified: b.emailVerified,
          emailSource: b.emailSource
        });
        const saved = await Buyer.findById(id, userId);
        if (saved) savedBuyers.push(saved);
      } catch (e) {
        logger.warn(`Failed to persist buyer ${b.companyName}: ${e.message}`);
      }
    }

    res.json({
      success: true,
      isDemo: result.isDemo,
      warning: result.error || null,
      message: result.isDemo
        ? 'Demo Mode — Configure SERPAPI_KEY in Settings for live SerpAPI buyer discovery.'
        : `Successfully discovered ${savedBuyers.length} buyers via API`,
      count: savedBuyers.length,
      buyers: savedBuyers.length > 0 ? savedBuyers : discoveredBuyers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all discovered buyers for current user
// @route   GET /api/buyers
exports.getBuyers = async (req, res, next) => {
  try {
    const buyers = await Buyer.findByUserId(req.user.id);
    res.json({
      success: true,
      count: buyers.length,
      buyers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single buyer by ID
// @route   GET /api/buyers/:id
exports.getBuyerById = async (req, res, next) => {
  try {
    const buyer = await Buyer.findById(req.params.id, req.user.id);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer record not found'
      });
    }
    res.json({
      success: true,
      buyer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete buyer record
// @route   DELETE /api/buyers/:id
exports.deleteBuyer = async (req, res, next) => {
  try {
    const deleted = await Buyer.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found or already deleted'
      });
    }
    res.json({
      success: true,
      message: 'Buyer record successfully deleted'
    });
  } catch (err) {
    next(err);
  }
};
