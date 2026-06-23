const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyfor-ai-cold-mail-generator-123456', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (generates and sends OTP)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists and is verified, reject registration
      if (userExists.isVerified) {
        res.status(400);
        throw new Error('User already exists');
      } else {
        // If user exists but is NOT verified, update their info and resend OTP
        userExists.name = name;
        userExists.password = password; // pre-save hook will hash it again if updated
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.otp = otp;
        userExists.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        
        await userExists.save();

        // Dispatch OTP with error handling
        try {
          await sendEmail({
            to: email,
            subject: 'AI Cold Mail Generator - Verify your Email',
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
            html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`,
          });
        } catch (emailErr) {
          console.error('Error resending OTP email:', emailErr);
          if (process.env.USE_MOCK_EMAIL !== 'true') {
            return res.status(500).json({
              success: false,
              message: `Failed to send verification email. Details: ${emailErr.message}. Make sure EMAIL_USER and EMAIL_PASS environment variables are configured correctly on Render.`,
            });
          }
        }

        return res.status(200).json({
          success: true,
          message: 'Account pending verification. Verification code resent.',
          email,
          ...(process.env.USE_MOCK_EMAIL === 'true' && { debugOtp: otp }),
        });
      }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (isVerified will default to false)
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry,
    });

    if (user) {
      // Dispatch OTP
      // Dispatch OTP with error handling
    try {
      await sendEmail({
        to: email,
        subject: 'AI Cold Mail Generator - Verify your Email',
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`,
      });
    } catch (emailErr) {
      console.error('Error sending OTP email:', emailErr);
      if (process.env.USE_MOCK_EMAIL !== 'true') {
        return res.status(500).json({
          success: false,
          message: `Failed to send verification email. Details: ${emailErr.message}. Make sure EMAIL_USER and EMAIL_PASS environment variables are configured correctly on Render.`,
        });
      }
    }

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please verify the OTP sent to your email.',
        email: user.email,
        ...(process.env.USE_MOCK_EMAIL === 'true' && { debugOtp: otp }),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User is already verified');
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      res.status(400);
      throw new Error('Invalid verification code');
    }

    if (new Date() > user.otpExpiry) {
      res.status(400);
      throw new Error('Verification code has expired');
    }

    // Verify and save
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      res.status(403);
      throw new Error('Please verify your email address first before logging in');
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
};
