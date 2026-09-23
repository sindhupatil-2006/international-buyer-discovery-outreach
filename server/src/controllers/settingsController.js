const Settings = require('../models/Settings');
const env = require('../config/env');

// @desc    Get user configuration settings
// @route   GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const settings = await Settings.getByUserId(userId);

    const isSystemSmtpConfigured = Boolean(env.smtp.user && env.smtp.password);
    const isSystemSerpApiConfigured = Boolean(env.serpApiKey);
    const isSystemGeminiConfigured = Boolean(env.geminiApiKey);

    if (!settings) {
      return res.json({
        success: true,
        settings: {
          smtpHost: env.smtp.host || 'smtp.gmail.com',
          smtpPort: env.smtp.port || 465,
          smtpUser: env.smtp.user ? maskString(env.smtp.user) : '',
          smtpFrom: env.smtp.from || '',
          hasCustomSmtp: false,
          hasCustomSerpApi: false,
          hasCustomGemini: false,
          systemSmtpConfigured: isSystemSmtpConfigured,
          systemSerpApiConfigured: isSystemSerpApiConfigured,
          systemGeminiConfigured: isSystemGeminiConfigured,
          serpapiKeyMasked: isSystemSerpApiConfigured ? '••••••••' : '',
          geminiApiKeyMasked: isSystemGeminiConfigured ? '••••••••' : ''
        }
      });
    }

    res.json({
      success: true,
      settings: {
        smtpHost: settings.smtpHost || env.smtp.host,
        smtpPort: settings.smtpPort || env.smtp.port,
        smtpUser: settings.smtpUser ? maskString(settings.smtpUser) : '',
        smtpFrom: settings.smtpFrom || '',
        hasCustomSmtp: Boolean(settings.smtpUser),
        hasCustomSerpApi: Boolean(settings.serpapiKey),
        hasCustomGemini: Boolean(settings.geminiApiKey),
        systemSmtpConfigured: isSystemSmtpConfigured,
        systemSerpApiConfigured: isSystemSerpApiConfigured,
        systemGeminiConfigured: isSystemGeminiConfigured,
        serpapiKeyMasked: settings.serpapiKey ? maskString(settings.serpapiKey) : (isSystemSerpApiConfigured ? '••••••••' : ''),
        geminiApiKeyMasked: settings.geminiApiKey ? maskString(settings.geminiApiKey) : (isSystemGeminiConfigured ? '••••••••' : '')
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user configuration settings
// @route   PUT /api/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { smtpHost, smtpPort, smtpUser, smtpFrom, serpapiKey, geminiApiKey } = req.body;

    const existing = await Settings.getByUserId(userId);

    // Keep existing secret if masked string or empty string submitted
    const finalSerpApi = (serpapiKey && !serpapiKey.includes('•'))
      ? serpapiKey
      : (existing ? existing.serpapiKey : null);

    const finalGemini = (geminiApiKey && !geminiApiKey.includes('•'))
      ? geminiApiKey
      : (existing ? existing.geminiApiKey : null);

    const finalSmtpUser = (smtpUser && !smtpUser.includes('•'))
      ? smtpUser
      : (existing ? existing.smtpUser : null);

    await Settings.upsert(userId, {
      smtpHost: smtpHost || 'smtp.gmail.com',
      smtpPort: parseInt(smtpPort || '465', 10),
      smtpUser: finalSmtpUser,
      smtpFrom: smtpFrom || finalSmtpUser,
      serpapiKey: finalSerpApi,
      geminiApiKey: finalGemini
    });

    res.json({
      success: true,
      message: 'Settings successfully saved'
    });
  } catch (err) {
    next(err);
  }
};

function maskString(str) {
  if (!str) return '';
  if (str.length <= 4) return '••••';
  return str.slice(0, 3) + '••••' + str.slice(-2);
}
