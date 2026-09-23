const db = require('../config/database');

class Outreach {
  static async create({ userId, buyerId, recipientEmail, companyName, subject, body, attachmentName, status, errorMessage }) {
    const sql = `
      INSERT INTO outreach
      (user_id, buyer_id, recipient_email, company_name, subject, body, attachment_name, status, error_message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      userId,
      buyerId || null,
      recipientEmail,
      companyName,
      subject,
      body,
      attachmentName || null,
      status || 'Sent',
      errorMessage || null
    ]);
    return result.insertId;
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT
        id,
        user_id AS userId,
        buyer_id AS buyerId,
        recipient_email AS recipientEmail,
        company_name AS companyName,
        subject,
        body,
        attachment_name AS attachmentName,
        status,
        error_message AS errorMessage,
        sent_at AS sentAt,
        created_at AS createdAt
      FROM outreach
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  }

  static async findById(id, userId) {
    const sql = `
      SELECT
        id,
        user_id AS userId,
        buyer_id AS buyerId,
        recipient_email AS recipientEmail,
        company_name AS companyName,
        subject,
        body,
        attachment_name AS attachmentName,
        status,
        error_message AS errorMessage,
        sent_at AS sentAt,
        created_at AS createdAt
      FROM outreach
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [id, userId]);
    return rows[0] || null;
  }

  static async delete(id, userId) {
    const sql = `DELETE FROM outreach WHERE id = ? AND user_id = ?`;
    const [result] = await db.query(sql, [id, userId]);
    return result.affectedRows > 0;
  }
}

module.exports = Outreach;
