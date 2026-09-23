const db = require('../config/database');

class Settings {
  static async getByUserId(userId) {
    const sql = `
      SELECT
        id,
        user_id AS userId,
        smtp_host AS smtpHost,
        smtp_port AS smtpPort,
        smtp_user AS smtpUser,
        smtp_from AS smtpFrom,
        serpapi_key AS serpapiKey,
        gemini_api_key AS geminiApiKey,
        created_at AS createdAt
      FROM settings
      WHERE user_id = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows[0] || null;
  }

  static async upsert(userId, { smtpHost, smtpPort, smtpUser, smtpFrom, serpapiKey, geminiApiKey }) {
    const existing = await this.getByUserId(userId);
    if (existing) {
      const sql = `
        UPDATE settings
        SET smtp_host = ?, smtp_port = ?, smtp_user = ?, smtp_from = ?, serpapi_key = ?, gemini_api_key = ?
        WHERE user_id = ?
      `;
      await db.query(sql, [
        smtpHost || 'smtp.gmail.com',
        smtpPort || 465,
        smtpUser || null,
        smtpFrom || null,
        serpapiKey || null,
        geminiApiKey || null,
        userId
      ]);
      return existing.id;
    } else {
      const sql = `
        INSERT INTO settings (user_id, smtp_host, smtp_port, smtp_user, smtp_from, serpapi_key, gemini_api_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(sql, [
        userId,
        smtpHost || 'smtp.gmail.com',
        smtpPort || 465,
        smtpUser || null,
        smtpFrom || null,
        serpapiKey || null,
        geminiApiKey || null
      ]);
      return result.insertId;
    }
  }
}

module.exports = Settings;
