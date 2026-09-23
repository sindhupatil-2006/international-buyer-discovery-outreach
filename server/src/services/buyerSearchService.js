const axios = require('axios');
const env = require('../config/env');
const Settings = require('../models/Settings');
const { processSerpItemAsync } = require('../utils/emailExtractor');
const logger = require('../utils/logger');

/**
 * Check if SerpAPI Key is configured for user or system env
 */
async function getSerpApiKey(userId) {
  let apiKey = env.serpApiKey;
  if (userId) {
    const settings = await Settings.getByUserId(userId);
    if (settings && settings.serpapiKey) {
      apiKey = settings.serpapiKey;
    }
  }
  return apiKey;
}

/**
 * Perform Real International Buyer Search via SerpAPI or Demo Mode Fallback
 */
async function searchBuyers({ userId, niche, country, limit = 10 }) {
  const apiKey = await getSerpApiKey(userId);

  logger.info(`[BUYER SEARCH] Niche: "${niche}", Country: "${country}", Limit: ${limit}`);

  // Step 6: If SERPAPI_KEY is missing, return clearly marked demo data
  if (!apiKey) {
    logger.info(`[DEMO MODE] SERPAPI_KEY not configured. Returning demo buyers.`);
    const demo = getDemoBuyers(niche, country, limit);
    return {
      demoMode: true,
      isDemo: true,
      buyers: demo.buyers
    };
  }

  try {
    // Step 3: Search Query Construction
    // Targeting wholesale distributors, buyers, importers with explicit contact hints
    const searchQuery = `"${niche}" "${country}" contact`;
    
    logger.info(`[SERPAPI] Request started`);

    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: searchQuery,
        api_key: apiKey,
        engine: 'google',
        num: Math.min(limit * 2, 20), // Fetch adequate results for deduplication
        gl: getCountryCode(country)
      },
      timeout: 10000
    });

    logger.info(`[SERPAPI] Response received`);

    const organicResults = response.data.organic_results || [];

    if (organicResults.length === 0) {
      logger.info('[BUYER SEARCH] 0 results returned from SerpAPI.');
      return {
        demoMode: false,
        isDemo: false,
        buyers: []
      };
    }

    const buyers = [];
    const seenDomains = new Set();
    const seenEmails = new Set();

    for (const item of organicResults) {
      const buyer = await processSerpItemAsync(item, country);

      // Step 3.9: Deduplicate by website domain or email
      if (buyer.website && seenDomains.has(buyer.website)) continue;
      if (buyer.email && seenEmails.has(buyer.email)) continue;

      if (buyer.website) seenDomains.add(buyer.website);
      if (buyer.email) seenEmails.add(buyer.email);

      buyers.push(buyer);

      if (buyers.length >= limit) break;
    }

    logger.info(`[BUYER SEARCH] ${buyers.length} results processed`);

    return {
      demoMode: false,
      isDemo: false,
      buyers
    };

  } catch (err) {
    logger.error(`[SERPAPI ERROR] Search failed (${err.message})`);
    throw new Error(`Search API Error: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * Realistic Curated Demo Buyers Generator (Fallback when SERPAPI_KEY is missing)
 */
function getDemoBuyers(niche, country, limit = 10) {
  const normalizedCountry = country || 'United States';
  const cleanNiche = niche || 'Home Decor Wholesale Importers';

  const demoPool = [
    {
      companyName: `Aura Home Decor Wholesalers`,
      email: `procurement@aurahomedecorwholesalers.com`,
      website: `https://www.aurahomedecorwholesalers.com`,
      country: normalizedCountry,
      description: `Major distributor of artisanal home decor, ceramic vases, and modern furniture for retail chains across ${normalizedCountry}.`,
      industry: `Home Decor`,
      sourceUrl: `https://google.com/search?q=${encodeURIComponent(niche)}`,
      emailVerified: true,
      emailSource: 'serpapi_snippet'
    },
    {
      companyName: `Pacific Rim Decor & Furnishings`,
      email: `purchasing@pacificrimdecor.org`,
      website: `https://www.pacificrimdecor.org`,
      country: normalizedCountry,
      description: `High-volume wholesale importer sourcing handcrafted textiles and living room decor items.`,
      industry: 'Home Decor',
      sourceUrl: `https://google.com/search?q=${encodeURIComponent(niche)}`,
      emailVerified: true,
      emailSource: 'serpapi_snippet'
    },
    {
      companyName: `Vanguard Living Group LLC`,
      email: null, // Realistic demo item with no email to test null state
      website: `https://www.vanguardlivinggroup.com`,
      country: normalizedCountry,
      description: `Commercial trade partner buying bulk shipment of modern decor accessories and wall art.`,
      industry: 'Home Decor',
      sourceUrl: `https://google.com/search?q=${encodeURIComponent(niche)}`,
      emailVerified: false,
      emailSource: 'not_found'
    },
    {
      companyName: `Crown Commercial Home Trade`,
      email: `trade@crowncommercialhometrade.com`,
      website: `https://www.crowncommercialhometrade.com`,
      country: normalizedCountry,
      description: `Wholesale distributor seeking factory-direct export partnerships for luxury decor collections.`,
      industry: 'Home Decor',
      sourceUrl: `https://google.com/search?q=${encodeURIComponent(niche)}`,
      emailVerified: true,
      emailSource: 'serpapi_snippet'
    },
    {
      companyName: `Horizon Decor Partners`,
      email: `buy@horizondecorpartners.co`,
      website: `https://www.horizondecorpartners.co`,
      country: normalizedCountry,
      description: `Multi-channel home accents distributor managing nationwide retail inventory.`,
      industry: 'Home Decor',
      sourceUrl: `https://google.com/search?q=${encodeURIComponent(niche)}`,
      emailVerified: true,
      emailSource: 'website_contact_page'
    }
  ];

  return {
    isDemo: true,
    buyers: demoPool.slice(0, limit)
  };
}

/**
 * Convert Country Name to 2-letter Country Code for SerpAPI
 */
function getCountryCode(country) {
  const map = {
    'United States': 'us',
    'United Kingdom': 'uk',
    'Germany': 'de',
    'Canada': 'ca',
    'Australia': 'au',
    'France': 'fr',
    'UAE': 'ae',
    'Netherlands': 'nl',
    'Italy': 'it',
    'Spain': 'es',
    'Japan': 'jp'
  };
  return map[country] || 'us';
}

module.exports = {
  searchBuyers,
  getSerpApiKey
};
