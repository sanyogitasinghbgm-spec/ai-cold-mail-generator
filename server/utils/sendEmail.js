const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  // If we are using mock mode, just log to stdout
  if (process.env.USE_MOCK_EMAIL === 'true') {
    console.log('\n=======================================');
    console.log(`[MOCK EMAIL SENT]`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`TEXT CONTENT: ${text}`);
    console.log('=======================================\n');
    return { mock: true, success: true };
  }

  // Validate Gmail credentials when not in mock mode
  if (process.env.USE_MOCK_EMAIL !== 'true') {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not set. Check EMAIL_USER and EMAIL_PASS in .env');
      throw new Error('Email credentials missing');
    }
  }
  const smtpConfig = {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000, // 5 seconds timeout
    socketTimeout: 5000,     // 5 seconds socket timeout
  };

  // Dynamic SMTP configurations
  if (process.env.EMAIL_HOST) {
    smtpConfig.host = process.env.EMAIL_HOST;
    smtpConfig.port = parseInt(process.env.EMAIL_PORT || '465', 10);
    // Secure defaults to true unless explicitly set to false
    smtpConfig.secure = process.env.EMAIL_SECURE === 'false' ? false : true;
  } else {
    smtpConfig.service = 'gmail';
  }

  const transporter = nodemailer.createTransport(smtpConfig);

  const mailOptions = {
    from: `"AI Cold Mail Generator" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email dispatched: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
