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
           !lower.endsWith('.svg') &&
           !lower.includes('example.com') &&
           !lower.includes('sentry.io') &&
           !lower.includes('wixpress.com') &&
           !lower.includes('schema.org');
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
 * Generates structured buyer object from SerpAPI search item
 */
function processSerpItem(item, country) {
  const title = item.title || '';
  const snippet = item.snippet || item.description || '';
  const website = item.link || item.url || '';
  const domain = extractDomain(website);
  const companyName = item.source || extractCompanyName(title, domain);

  const textToScan = `${title} ${snippet}`;
  const foundEmails = extractEmailsFromText(textToScan);

  let email = '';
  let emailVerified = false;
  let emailSource = '';

  if (foundEmails.length > 0) {
    email = foundEmails[0];
    emailVerified = true;
    emailSource = 'serpapi_snippet';
  } else if (domain) {
    // Structural estimated contact email based on domain
    email = `contact@${domain}`;
    emailVerified = false;
    emailSource = 'estimated_domain';
  } else {
    email = `sales@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'buyer'}.com`;
    emailVerified = false;
    emailSource = 'estimated_name';
  }

  return {
    companyName: companyName || 'Global Business Buyer',
    email,
    website: website || (domain ? `https://${domain}` : ''),
    country: country || 'United States',
    description: snippet || `Discovered international buyer in ${country}`,
    industry: 'Wholesale & Distribution',
    sourceUrl: website,
    emailVerified,
    emailSource
  };
}

module.exports = {
  extractEmailsFromText,
  extractDomain,
  extractCompanyName,
  processSerpItem
};
