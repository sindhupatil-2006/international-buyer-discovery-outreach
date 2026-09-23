const db = require('../config/database');

class Buyer {
  static async create({ userId, companyName, email, website, country, description, industry, sourceUrl, emailVerified, emailSource }) {
    const sql = `
      INSERT INTO buyers
      (user_id, company_name, email, website, country, description, industry, source_url, email_verified, email_source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      userId,
      companyName,
      email,
      website || null,
      country,
      description || null,
      industry || 'Wholesale',
      sourceUrl || null,
      emailVerified ? 1 : 0,
      emailSource || 'serpapi_snippet'
    ]);
    return result.insertId;
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT
        id,
        user_id AS userId,
        company_name AS companyName,
        email,
        website,
        country,
        description,
        industry,
        source_url AS sourceUrl,
        email_verified AS emailVerified,
        email_source AS emailSource,
        created_at AS createdAt
      FROM buyers
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows.map(r => ({ ...r, emailVerified: Boolean(r.emailVerified) }));
  }

  static async findById(id, userId) {
    const sql = `
      SELECT
        id,
        user_id AS userId,
        company_name AS companyName,
        email,
        website,
        country,
        description,
        industry,
        source_url AS sourceUrl,
        email_verified AS emailVerified,
        email_source AS emailSource,
        created_at AS createdAt
      FROM buyers
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [id, userId]);
    if (!rows[0]) return null;
    return { ...rows[0], emailVerified: Boolean(rows[0].emailVerified) };
  }

  static async delete(id, userId) {
    const sql = `DELETE FROM buyers WHERE id = ? AND user_id = ?`;
    const [result] = await db.query(sql, [id, userId]);
    return result.affectedRows > 0;
  }
}

module.exports = Buyer;
