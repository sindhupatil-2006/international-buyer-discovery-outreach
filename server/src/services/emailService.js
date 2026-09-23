const nodemailer = require('nodemailer');
const fs = require('fs');
const env = require('../config/env');
const Settings = require('../models/Settings');
const logger = require('../utils/logger');

/**
 * Send Outreach Email via Nodemailer SMTP or Safe Demo Mode
 */
async function sendOutreachEmail({ userId, recipientEmail, companyName, subject, body, attachment }) {
  // Retrieve custom SMTP settings if configured
  let smtpConfig = {
    host: env.smtp.host,
    port: env.smtp.port,
    user: env.smtp.user,
    pass: env.smtp.password,
    from: env.smtp.from || env.smtp.user
  };

  if (userId) {
    const userSettings = await Settings.getByUserId(userId);
    if (userSettings && userSettings.smtpUser) {
      smtpConfig = {
        host: userSettings.smtpHost || env.smtp.host,
        port: userSettings.smtpPort || env.smtp.port,
        user: userSettings.smtpUser,
        pass: env.smtp.password, // Passwords stay server-side env / secure
        from: userSettings.smtpFrom || userSettings.smtpUser
      };
    }
  }

  // Check if live SMTP credentials are fully provided
  const isSmtpConfigured = Boolean(smtpConfig.user && (smtpConfig.pass || env.smtp.password));

  if (!isSmtpConfigured) {
    logger.info(`[EMAIL DEMO MODE] SMTP credentials not fully configured. Simulating successful send to ${recipientEmail}`);
    
    // Cleanup temporary attachment file if uploaded
    if (attachment && attachment.path) {
      try {
        if (fs.existsSync(attachment.path)) {
          fs.unlinkSync(attachment.path);
        }
      } catch (err) {
        logger.warn(`Failed to cleanup temp file: ${err.message}`);
      }
    }

    return {
      isDemo: true,
      success: true,
      message: 'Outreach email simulated successfully (Email Demo Mode — configure SMTP in Settings to send real emails).'
    };
  }

  // Live SMTP Transport Setup
  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465, // SSL for 465, STARTTLS for 587
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass || env.smtp.password
      }
    });

    const mailOptions = {
      from: `Export Desk <${smtpConfig.from}>`,
      to: recipientEmail,
      subject: subject,
      text: body,
      html: formatEmailHtml(companyName, body)
    };

    if (attachment && attachment.path) {
      mailOptions.attachments = [
        {
          filename: attachment.originalname || attachment.filename,
          path: attachment.path
        }
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email successfully dispatched to ${recipientEmail}. MessageId: ${info.messageId}`);

    // Cleanup attachment after sending
    if (attachment && attachment.path && fs.existsSync(attachment.path)) {
      try {
        fs.unlinkSync(attachment.path);
      } catch (e) {}
    }

    return {
      isDemo: false,
      success: true,
      messageId: info.messageId,
      message: 'Email successfully sent via Nodemailer SMTP'
    };

  } catch (err) {
    logger.error(`Nodemailer SMTP Error: ${err.message}`);
    // Cleanup attachment on error
    if (attachment && attachment.path && fs.existsSync(attachment.path)) {
      try {
        fs.unlinkSync(attachment.path);
      } catch (e) {}
    }

    throw new Error(`SMTP Delivery Failed: ${err.message}`);
  }
}

/**
 * Format Clean Professional B2B Email HTML Wrapper
 */
function formatEmailHtml(companyName, bodyText) {
  const paragraphs = bodyText.split('\n').map(p => p.trim()).filter(Boolean);
  const formattedContent = paragraphs.map(p => `<p style="margin-bottom: 14px; line-height: 1.6; color: #1e293b;">${p}</p>`).join('');

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px;">
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1e3a8a; font-size: 20px; font-weight: 700;">International Trade & Export Inquiry</h2>
        </div>
        <div>
          ${formattedContent}
        </div>
        <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Sent via International Buyer Discovery & Outreach Desk.</p>
        </div>
      </div>
    </div>
  `;
}

module.exports = {
  sendOutreachEmail
};
