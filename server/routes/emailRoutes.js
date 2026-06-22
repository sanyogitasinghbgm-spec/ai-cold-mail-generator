const express = require('express');
const router = express.Router();
const {
  generateEmail,
  getEmailHistory,
} = require('../controllers/emailController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate', protect, generateEmail);
router.get('/history', protect, getEmailHistory);

module.exports = router;
