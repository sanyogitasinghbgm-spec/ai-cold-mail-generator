const EmailHistory = require('../models/EmailHistory');
const { generateCampaign } = require('../utils/groqAI');

// @desc    Generate email campaign and save to history
// @route   POST /api/email/generate
// @access  Private
const generateEmail = async (req, res, next) => {
  try {
    const { prompt, tone = 'Professional', targetAudience = 'Recruiter' } = req.body;

    if (!prompt) {
      res.status(400);
      throw new Error('Please provide a prompt describing your cold email goal');
    }

    // Call Groq AI campaign generator
    const campaign = await generateCampaign(prompt, tone, targetAudience);

    // Save history
    const historyItem = await EmailHistory.create({
      user: req.user.id,
      prompt,
      tone,
      targetAudience,
      subject: campaign.subject,
      body: campaign.body,
      linkedinDm: campaign.linkedinDm,
      followUp: campaign.followUp,
    });

    res.status(201).json({
      success: true,
      message: 'Campaign generated successfully!',
      data: historyItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's generated email history
// @route   GET /api/email/history
// @access  Private
const getEmailHistory = async (req, res, next) => {
  try {
    const history = await EmailHistory.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateEmail,
  getEmailHistory,
};
