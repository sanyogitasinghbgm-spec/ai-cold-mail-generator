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

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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
