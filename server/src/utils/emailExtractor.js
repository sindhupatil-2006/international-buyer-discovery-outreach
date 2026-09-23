const axios = require('axios');
const logger = require('./logger');

/**
 * Email Extraction & Domain Sanitization Utility
 */

// Comprehensive Regex for extracting valid email addresses from search snippets & titles
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

/**
 * Extract all unique emails from a given text string.
 */
function extractEmailsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(EMAIL_REGEX) || [];
  
  // Filter out common false positives like file extensions or placeholder emails
  const cleanEmails = matches.filter(email => {
    const lower = email.toLowerCase();
    return !lower.endsWith('.png') &&
           !lower.endsWith('.jpg') &&
           !lower.endsWith('.jpeg') &&
           !lower.endsWith('.gif') &&
           !lower.endsWith('.svg') &&
           !lower.endsWith('.webp') &&
           !lower.includes('example.com') &&
           !lower.includes('sentry.io') &&
           !lower.includes('wixpress.com') &&
           !lower.includes('schema.org') &&
           !lower.includes('domain.com') &&
           !lower.includes('yoursite.com');
  });
  return Array.from(new Set(cleanEmails));
}

/**
 * Extract root domain from URL string
 */
function extractDomain(urlStr) {
  try {
    if (!urlStr) return '';
    let formatted = urlStr.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    const url = new URL(formatted);
    let host = url.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    return host;
  } catch (err) {
    return '';
  }
}

/**
 * Clean and format company name from search title or domain
 */
function extractCompanyName(title, domain) {
  if (title) {
    // Remove trailing site names or common suffixes like "| Home", "- Wholesale", "Official Store"
    let cleaned = title.split(/[-|–|:]/)[0].trim();
    cleaned = cleaned.replace(/\b(Inc|LLC|Ltd|Group|Co|Corp|Wholesale|Distributor|Official Store|Home Page)\b/gi, '').trim();
    if (cleaned.length > 2) return cleaned;
  }

  if (domain) {
    const namePart = domain.split('.')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  return 'International Trade Partner';
}

/**
 * Secondary Process: Fetch publicly accessible website contact page to extract publicly listed email
 */
async function fetchEmailFromWebsite(websiteUrl) {
  if (!websiteUrl) return null;
  try {
    let target = websiteUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    
    const response = await axios.get(target, {
      timeout: 3500,
      maxRedirects: 2,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (typeof response.data === 'string') {
      const found = extractEmailsFromText(response.data);
      if (found.length > 0) {
        return found[0];
      }
    }
  } catch (err) {
    // Safe timeout or network restriction — silent fallback to null
  }
  return null;
}

/**
 * Generates normalized buyer object from SerpAPI search item
 */
async function processSerpItemAsync(item, country) {
  const title = item.title || '';
  const snippet = item.snippet || item.description || '';
  const website = item.link || item.url || '';
  const domain = extractDomain(website);
  const companyName = item.source || extractCompanyName(title, domain);

  const textToScan = `${title} ${snippet}`;
  const snippetEmails = extractEmailsFromText(textToScan);

  let email = null;
  let emailVerified = false;
  let emailSource = 'not_found';

  if (snippetEmails.length > 0) {
    email = snippetEmails[0];
    emailVerified = true;
    emailSource = 'serpapi_snippet';
  } else if (website) {
    // Step 5: Secondary Process - Safe fetch website for public contact email
    const fetchedEmail = await fetchEmailFromWebsite(website);
    if (fetchedEmail) {
      email = fetchedEmail;
      emailVerified = false;
      emailSource = 'website_contact_page';
    }
  }

  return {
    companyName: companyName || 'Global Business Buyer',
    email: email || null, // Real email or null - NO INVENTED FAKE EMAILS
    website: website || (domain ? `https://${domain}` : ''),
    country: country || 'United States',
    description: snippet || `Discovered international buyer in ${country}`,
    industry: 'Home Decor & Trade',
    sourceUrl: website,
    emailVerified,
    emailSource
  };
}

module.exports = {
  extractEmailsFromText,
  extractDomain,
  extractCompanyName,
  fetchEmailFromWebsite,
  processSerpItemAsync
};
