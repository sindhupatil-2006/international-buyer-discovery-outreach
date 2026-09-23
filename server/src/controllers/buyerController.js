const Buyer = require('../models/Buyer');
const Search = require('../models/Search');
const { searchBuyers, getSerpApiKey } = require('../services/buyerSearchService');
const logger = require('../utils/logger');

// @desc    Get SerpAPI Integration Status
// @route   GET /api/buyers/api-status
exports.getApiStatus = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const apiKey = await getSerpApiKey(userId);
    const configured = Boolean(apiKey);

    res.json({
      configured,
      provider: 'SerpAPI',
      demoMode: !configured
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Discover International Buyers via Search API
// @route   POST /api/buyers/search
exports.search = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { niche, country, limit = 10 } = req.body;

    // Request Validation (Step 3)
    if (!niche || typeof niche !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid buyer niche is required',
        errorCode: 'INVALID_NICHE'
      });
    }

    if (!country || typeof country !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid target country is required',
        errorCode: 'INVALID_COUNTRY'
      });
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit || 10, 10), 1), 50);

    let result;
    try {
      result = await searchBuyers({
        userId,
        niche: niche.trim(),
        country: country.trim(),
        limit: parsedLimit
      });
    } catch (apiErr) {
      logger.error(`Search Controller caught API failure: ${apiErr.message}`);
      return res.status(500).json({
        success: false,
        message: 'Unable to search buyers at this time. Please check your API configuration or network connection.',
        errorCode: 'SEARCH_API_ERROR'
      });
    }

    const discoveredBuyers = result.buyers || [];

    // Save search attempt in history
    try {
      await Search.create({
        userId,
        niche: niche.trim(),
        country: country.trim(),
        resultsCount: discoveredBuyers.length
      });
    } catch (dbErr) {
      logger.warn(`Failed to save search history log: ${dbErr.message}`);
    }

    // Save discovered buyers into database
    const savedBuyers = [];
    for (const b of discoveredBuyers) {
      try {
        const id = await Buyer.create({
          userId,
          companyName: b.companyName,
          email: b.email || null, // Preserve null when no email found - NO FAKE EMAILS
          website: b.website,
          country: b.country,
          description: b.description,
          industry: b.industry || 'Home Decor',
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

    const finalBuyers = savedBuyers.length > 0 ? savedBuyers : discoveredBuyers;

    res.json({
      success: true,
      demoMode: result.demoMode,
      isDemo: result.isDemo,
      message: result.demoMode
        ? 'Demo Mode Active — Configure SERPAPI_KEY in Settings for live buyer discovery.'
        : `Live API Connected — Discovered ${finalBuyers.length} buyers via SerpAPI`,
      count: finalBuyers.length,
      buyers: finalBuyers
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
