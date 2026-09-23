const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

let pool = null;
let isInMemoryFallback = false;

// In-memory / File storage fallback for seamless execution when MySQL server is not locally running
const fallbackStore = {
  users: [],
  searches: [],
  buyers: [],
  outreach: [],
  settings: [],
  userCounter: 1,
  searchCounter: 1,
  buyerCounter: 1,
  outreachCounter: 1,
  settingsCounter: 1
};

async function initDb() {
  try {
    pool = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.name,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    logger.info(`Connected successfully to MySQL database: ${env.db.name}`);
  } catch (err) {
    logger.warn(`MySQL connection failed (${err.message}). Falling back to internal structured data engine.`);
    isInMemoryFallback = true;
  }
}

// Universal query runner supporting MySQL parameterized queries or fallback engine
async function query(sql, params = []) {
  if (!pool || isInMemoryFallback) {
    return handleFallbackQuery(sql, params);
  }
  try {
    return await pool.query(sql, params);
  } catch (err) {
    logger.error(`Database Query Error: ${err.message}`);
    throw err;
  }
}

// Fallback logic simulator for SQL operations
function handleFallbackQuery(sql, params) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  const upper = cleanSql.toUpperCase();

  // Users Queries
  if (upper.startsWith('INSERT INTO USERS')) {
    const id = fallbackStore.userCounter++;
    const [name, email, password_hash, company_name] = params;
    const user = { id, name, email, password_hash, company_name: company_name || null, created_at: new Date() };
    fallbackStore.users.push(user);
    return [{ insertId: id, affectedRows: 1 }, null];
  }
  if (upper.includes('FROM USERS WHERE EMAIL =')) {
    const email = params[0];
    const user = fallbackStore.users.find(u => u.email === email);
    return [[user].filter(Boolean), null];
  }
  if (upper.includes('FROM USERS WHERE ID =')) {
    const id = parseInt(params[0], 10);
    const user = fallbackStore.users.find(u => u.id === id);
    return [[user].filter(Boolean), null];
  }

  // Searches Queries
  if (upper.startsWith('INSERT INTO SEARCHES')) {
    const id = fallbackStore.searchCounter++;
    const [user_id, niche, country, results_count] = params;
    const search = { id, user_id, niche, country, results_count, created_at: new Date() };
    fallbackStore.searches.push(search);
    return [{ insertId: id, affectedRows: 1 }, null];
  }
  if (upper.includes('FROM SEARCHES WHERE USER_ID =')) {
    const userId = parseInt(params[0], 10);
    const list = fallbackStore.searches.filter(s => s.user_id === userId).sort((a,b) => b.created_at - a.created_at);
    return [list, null];
  }

  // Buyers Queries
  if (upper.startsWith('INSERT INTO BUYERS')) {
    const id = fallbackStore.buyerCounter++;
    const [user_id, company_name, email, website, country, description, industry, source_url, email_verified, email_source] = params;
    const buyer = {
      id,
      user_id,
      company_name,
      email,
      website: website || null,
      country,
      description: description || '',
      industry: industry || '',
      source_url: source_url || '',
      email_verified: email_verified ? 1 : 0,
      email_source: email_source || 'serpapi_snippet',
      created_at: new Date()
    };
    fallbackStore.buyers.push(buyer);
    return [{ insertId: id, affectedRows: 1 }, null];
  }
  if (upper.includes('FROM BUYERS WHERE USER_ID =')) {
    const userId = parseInt(params[0], 10);
    let list = fallbackStore.buyers.filter(b => b.user_id === userId);
    if (upper.includes('ORDER BY CREATED_AT DESC')) {
      list = list.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
    const formatted = list.map(b => ({
      id: b.id,
      userId: b.user_id,
      companyName: b.company_name,
      email: b.email,
      website: b.website,
      country: b.country,
      description: b.description,
      industry: b.industry,
      sourceUrl: b.source_url,
      emailVerified: Boolean(b.email_verified),
      emailSource: b.email_source,
      createdAt: b.created_at
    }));
    return [formatted, null];
  }
  if (upper.includes('FROM BUYERS WHERE ID =')) {
    const id = parseInt(params[0], 10);
    const userId = parseInt(params[1], 10);
    const buyer = fallbackStore.buyers.find(b => b.id === id && (isNaN(userId) || b.user_id === userId));
    if (!buyer) return [[], null];
    const formatted = {
      id: buyer.id,
      userId: buyer.user_id,
      companyName: buyer.company_name,
      email: buyer.email,
      website: buyer.website,
      country: buyer.country,
      description: buyer.description,
      industry: buyer.industry,
      sourceUrl: buyer.source_url,
      emailVerified: Boolean(buyer.email_verified),
      emailSource: buyer.email_source,
      createdAt: buyer.created_at
    };
    return [[formatted], null];
  }
  if (upper.startsWith('DELETE FROM BUYERS')) {
    const id = parseInt(params[0], 10);
    const userId = parseInt(params[1], 10);
    const initLen = fallbackStore.buyers.length;
    fallbackStore.buyers = fallbackStore.buyers.filter(b => !(b.id === id && b.user_id === userId));
    return [{ affectedRows: initLen - fallbackStore.buyers.length }, null];
  }

  // Outreach Queries
  if (upper.startsWith('INSERT INTO OUTREACH')) {
    const id = fallbackStore.outreachCounter++;
    const [user_id, buyer_id, recipient_email, company_name, subject, body, attachment_name, status, error_message] = params;
    const item = {
      id,
      user_id,
      buyer_id: buyer_id || null,
      recipient_email,
      company_name,
      subject,
      body,
      attachment_name: attachment_name || null,
      status: status || 'Sent',
      error_message: error_message || null,
      sent_at: new Date(),
      created_at: new Date()
    };
    fallbackStore.outreach.push(item);
    return [{ insertId: id, affectedRows: 1 }, null];
  }
  if (upper.includes('FROM OUTREACH WHERE USER_ID =')) {
    const userId = parseInt(params[0], 10);
    let list = fallbackStore.outreach.filter(o => o.user_id === userId).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const formatted = list.map(o => ({
      id: o.id,
      userId: o.user_id,
      buyerId: o.buyer_id,
      recipientEmail: o.recipient_email,
      companyName: o.company_name,
      subject: o.subject,
      body: o.body,
      attachmentName: o.attachment_name,
      status: o.status,
      errorMessage: o.error_message,
      sentAt: o.sent_at,
      createdAt: o.created_at
    }));
    return [formatted, null];
  }
  if (upper.includes('FROM OUTREACH WHERE ID =')) {
    const id = parseInt(params[0], 10);
    const userId = parseInt(params[1], 10);
    const item = fallbackStore.outreach.find(o => o.id === id && o.user_id === userId);
    if (!item) return [[], null];
    const formatted = {
      id: item.id,
      userId: item.user_id,
      buyerId: item.buyer_id,
      recipientEmail: item.recipient_email,
      companyName: item.company_name,
      subject: item.subject,
      body: item.body,
      attachmentName: item.attachment_name,
      status: item.status,
      errorMessage: item.error_message,
      sentAt: item.sent_at,
      createdAt: item.created_at
    };
    return [[formatted], null];
  }
  if (upper.startsWith('DELETE FROM OUTREACH')) {
    const id = parseInt(params[0], 10);
    const userId = parseInt(params[1], 10);
    const initLen = fallbackStore.outreach.length;
    fallbackStore.outreach = fallbackStore.outreach.filter(o => !(o.id === id && o.user_id === userId));
    return [{ affectedRows: initLen - fallbackStore.outreach.length }, null];
  }

  // Settings Queries
  if (upper.includes('FROM SETTINGS WHERE USER_ID =')) {
    const userId = parseInt(params[0], 10);
    const setting = fallbackStore.settings.find(s => s.user_id === userId);
    return [[setting].filter(Boolean), null];
  }
  if (upper.startsWith('INSERT INTO SETTINGS')) {
    const id = fallbackStore.settingsCounter++;
    const [user_id, smtp_host, smtp_port, smtp_user, smtp_from, serpapi_key, gemini_api_key] = params;
    const s = { id, user_id, smtp_host, smtp_port, smtp_user, smtp_from, serpapi_key, gemini_api_key, created_at: new Date() };
    fallbackStore.settings.push(s);
    return [{ insertId: id, affectedRows: 1 }, null];
  }
  if (upper.startsWith('UPDATE SETTINGS SET')) {
    const userId = params[params.length - 1];
    let s = fallbackStore.settings.find(st => st.user_id === userId);
    if (!s) {
      s = { id: fallbackStore.settingsCounter++, user_id: userId, created_at: new Date() };
      fallbackStore.settings.push(s);
    }
    s.smtp_host = params[0];
    s.smtp_port = params[1];
    s.smtp_user = params[2];
    s.smtp_from = params[3];
    s.serpapi_key = params[4];
    s.gemini_api_key = params[5];
    s.updated_at = new Date();
    return [{ affectedRows: 1 }, null];
  }

  // Aggregate Stats Queries
  if (upper.includes('COUNT(*) AS TOTAL_BUYERS')) {
    const userId = parseInt(params[0], 10);
    const buyersCount = fallbackStore.buyers.filter(b => b.user_id === userId).length;
    const outreachCount = fallbackStore.outreach.filter(o => o.user_id === userId).length;
    const today = new Date().toISOString().slice(0, 10);
    const sentToday = fallbackStore.outreach.filter(o => o.user_id === userId && new Date(o.sent_at).toISOString().slice(0, 10) === today).length;
    const searchesCount = fallbackStore.searches.filter(s => s.user_id === userId).length;
    const successfulCount = fallbackStore.outreach.filter(o => o.user_id === userId && o.status === 'Sent').length;
    const failedCount = fallbackStore.outreach.filter(o => o.user_id === userId && o.status === 'Failed').length;

    return [[{
      totalBuyers: buyersCount,
      totalOutreach: outreachCount,
      sentToday: sentToday,
      totalSearches: searchesCount,
      successfulOutreach: successfulCount,
      failedOutreach: failedCount
    }], null];
  }

  return [[], null];
}

module.exports = {
  initDb,
  query,
  isInMemoryFallback: () => isInMemoryFallback
};
