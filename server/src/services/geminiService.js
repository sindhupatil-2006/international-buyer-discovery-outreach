const axios = require('axios');
const env = require('../config/env');
const Settings = require('../models/Settings');
const logger = require('../utils/logger');

/**
 * Generate AI Email Pitch via Google Gemini API or Smart B2B Copywriting Template
 */
async function generateAiPitch({ userId, companyName, industry, country, product }) {
  let apiKey = env.geminiApiKey;
  if (userId) {
    const settings = await Settings.getByUserId(userId);
    if (settings && settings.geminiApiKey) {
      apiKey = settings.geminiApiKey;
    }
  }

  const company = companyName || 'your esteemed organization';
  const targetCountry = country || 'international markets';
  const productCategory = product || 'premium export collections';

  // If Gemini API Key is configured, attempt REST call to Google Gemini API
  if (apiKey) {
    try {
      logger.info(`Generating personalized pitch via Gemini API for ${company}...`);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an expert B2B international export trade consultant. Write a professional, concise, high-converting B2B sales outreach email to purchasing managers at "${company}", located in ${targetCountry}, specializing in ${industry || 'Wholesale Trade'}. We are direct manufacturers/exporters of ${productCategory}.\n\nRequirements:\n- Professional, respectful tone.\n- Focus on direct factory supply, competitive wholesale pricing, quality assurance, and reliable trade terms.\n- Include placeholder {{company}} for company name.\n- Keep it under 200 words.\n- Return JSON with format: {"subject": "...", "body": "..."}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        },
        { timeout: 8000 }
      );

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          isAiGenerated: true,
          subject: parsed.subject || `Direct Manufacturer Supply & Trade Inquiry: ${productCategory}`,
          body: parsed.body || getDefaultTemplate(company, productCategory, targetCountry)
        };
      }
    } catch (err) {
      logger.warn(`Gemini API call failed (${err.message}). Using intelligent template engine.`);
    }
  }

  // Smart B2B Copywriting Template Engine (Fallback when Gemini API is unconfigured/fails)
  return {
    isAiGenerated: false,
    subject: `Export Inquiry: Direct Manufacturer Supply for ${productCategory}`,
    body: getDefaultTemplate(company, productCategory, targetCountry)
  };
}

function getDefaultTemplate(company, productCategory, targetCountry) {
  return `Dear Purchasing Team at {{company}},

We are direct exporters and manufacturers of high-quality ${productCategory}.

We are expanding our wholesale distribution network in ${targetCountry} and would like to explore a potential strategic supply partnership with {{company}}.

Key Highlights of Partnering with Us:
- Factory-Direct Wholesale Pricing (eliminating middleman margins)
- Strict International Quality Assurance & Compliance Standards
- Flexible Low Minimum Order Quantities (MOQ)
- Streamlined Export Logistics & Fast Order Dispatch

Please review our wholesale product offerings. We would be delighted to share our catalog and customized pricing sheet for your review.

Looking forward to discussing how we can add value to your product line.

Best regards,

International Trade & Export Desk
Global Supply Chain Division`;
}

module.exports = {
  generateAiPitch
};
