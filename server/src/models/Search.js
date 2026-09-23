const db = require('../config/database');

class Search {
  static async create({ userId, niche, country, resultsCount }) {
    const sql = `
      INSERT INTO searches (user_id, niche, country, results_count)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [userId, niche, country, resultsCount]);
    return result.insertId;
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT id, user_id AS userId, niche, country, results_count AS resultsCount, created_at AS createdAt
      FROM searches
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  }
}

module.exports = Search;
