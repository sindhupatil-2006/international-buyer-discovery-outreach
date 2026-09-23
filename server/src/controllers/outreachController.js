const Outreach = require('../models/Outreach');
const Buyer = require('../models/Buyer');
const { sendOutreachEmail } = require('../services/emailService');
const { generateAiPitch } = require('../services/geminiService');
const logger = require('../utils/logger');

// @desc    Send Personalized Outreach Email to Buyer
// @route   POST /api/outreach/send
exports.sendEmail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { buyerId, recipientEmail, companyName, subject, body } = req.body;
    const attachment = req.file || null;

    logger.info(`User ${userId} sending email to ${recipientEmail} (${companyName})`);

    // Replace {{company}} placeholders in body and subject
    const finalSubject = (subject || '').replace(/\{\{company\}\}/g, companyName);
    const finalBody = (body || '').replace(/\{\{company\}\}/g, companyName);

    let sendResult;
    let status = 'Sent';
    let errorMessage = null;

    try {
      sendResult = await sendOutreachEmail({
        userId,
        recipientEmail,
        companyName,
        subject: finalSubject,
        body: finalBody,
        attachment
      });
    } catch (err) {
      status = 'Failed';
      errorMessage = err.message;
      sendResult = {
        success: false,
        message: err.message
      };
    }

    // Record outreach in database history
    const outreachId = await Outreach.create({
      userId,
      buyerId: buyerId ? parseInt(buyerId, 10) : null,
      recipientEmail,
      companyName,
      subject: finalSubject,
      body: finalBody,
      attachmentName: attachment ? attachment.originalname : null,
      status,
      errorMessage
    });

    if (status === 'Failed') {
      return res.status(400).json({
        success: false,
        outreachId,
        message: sendResult.message || 'Failed to send outreach email',
        error: errorMessage
      });
    }

    res.json({
      success: true,
      isDemo: sendResult.isDemo,
      message: sendResult.isDemo
        ? 'Outreach simulated successfully (Email Demo Mode — Configure SMTP credentials in Settings for live delivery).'
        : 'Outreach email successfully sent!',
      outreachId
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate AI Personalized Email Pitch (Gemini API)
// @route   POST /api/outreach/generate
exports.generatePitch = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { companyName, industry, country, product } = req.body;

    const pitch = await generateAiPitch({
      userId,
      companyName,
      industry,
      country,
      product
    });

    res.json({
      success: true,
      ...pitch
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all outreach history for user
// @route   GET /api/outreach
exports.getOutreachHistory = async (req, res, next) => {
  try {
    const list = await Outreach.findByUserId(req.user.id);
    res.json({
      success: true,
      count: list.length,
      outreach: list
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single outreach record by ID
// @route   GET /api/outreach/:id
exports.getOutreachById = async (req, res, next) => {
  try {
    const item = await Outreach.findById(req.params.id, req.user.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Outreach log record not found'
      });
    }
    res.json({
      success: true,
      outreach: item
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete outreach log record
// @route   DELETE /api/outreach/:id
exports.deleteOutreach = async (req, res, next) => {
  try {
    const deleted = await Outreach.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Outreach record not found or already deleted'
      });
    }
    res.json({
      success: true,
      message: 'Outreach record successfully deleted'
    });
  } catch (err) {
    next(err);
  }
};
