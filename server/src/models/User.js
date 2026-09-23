const db = require('../config/database');

class User {
  static async create({ name, email, passwordHash, companyName }) {
    const sql = `
      INSERT INTO users (name, email, password_hash, company_name)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [name, email, passwordHash, companyName || null]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const [rows] = await db.query(sql, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const sql = `SELECT id, name, email, company_name, created_at FROM users WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = User;
