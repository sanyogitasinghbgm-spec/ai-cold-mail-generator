const nodemailer = require('nodemailer');

// Connection pooling cache for SMTP to avoid slow handshakes on every request
let cachedTransporter = null;
let cachedCredentialsKey = '';

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

  // Support Resend HTTP API (Port 443, never blocked by Render)
  if (process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY detected. Sending email via Resend HTTP API...');
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>';
    return new Promise((resolve, reject) => {
      const https = require('https');
      const reqData = JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: subject,
        html: html,
        text: text
      });
      const req = https.request({
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(reqData)
        },
        timeout: 5000
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(body);
              console.log(`Email successfully dispatched via Resend: ${parsed.id}`);
              resolve(parsed);
            } catch (e) {
              resolve({ success: true, raw: body });
            }
          } else {
            reject(new Error(`Resend API failed with status ${res.statusCode}: ${body}`));
          }
        });
      });
      req.on('error', (err) => {
        console.error('Resend HTTPS request error:', err);
        reject(err);
      });
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Resend HTTPS request timed out'));
      });
      req.write(reqData);
      req.end();
    });
  }

  // Support Brevo HTTP API (Port 443, never blocked by Render)
  if (process.env.BREVO_API_KEY) {
    console.log('BREVO_API_KEY detected. Sending email via Brevo HTTP API...');
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'sanyogitasinghbgm@gmail.com';
    return new Promise((resolve, reject) => {
      const https = require('https');
      const reqData = JSON.stringify({
        sender: {
          name: 'AI Cold Mail Generator',
          email: senderEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        textContent: text
      });
      const req = https.request({
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(reqData)
        },
        timeout: 5000
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(body);
              console.log(`Email successfully dispatched via Brevo: ${parsed.messageId}`);
              resolve(parsed);
            } catch (e) {
              resolve({ success: true, raw: body });
            }
          } else {
            reject(new Error(`Brevo API failed with status ${res.statusCode}: ${body}`));
          }
        });
      });
      req.on('error', (err) => {
        console.error('Brevo HTTPS request error:', err);
        reject(err);
      });
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Brevo HTTPS request timed out'));
      });
      req.write(reqData);
      req.end();
    });
  }

  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '465', 10);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  // Validate credentials when not in mock mode
  if (process.env.USE_MOCK_EMAIL !== 'true') {
    if (!user || !pass) {
      console.error('Email credentials not set. Check EMAIL_USER and EMAIL_PASS in environment variables.');
      throw new Error('Email credentials missing');
    }
  }

  const credentialsKey = `${host || 'gmail'}:${port}:${user}:${pass}`;
  let transporter;

  if (cachedTransporter && cachedCredentialsKey === credentialsKey) {
    transporter = cachedTransporter;
  } else {
    const smtpConfig = {
      auth: {
        user: user,
        pass: pass,
      },
      pool: true, // Enable connection pooling
      maxConnections: 5,
      maxMessages: 100,
      connectionTimeout: 5000, // 5 seconds timeout
      socketTimeout: 5000,     // 5 seconds socket timeout
    };

    // Setup transporter dynamically
    if (host) {
      console.log(`SMTP Connection Attempt (Pooled): Host=${host}, Port=${port}`);
      smtpConfig.host = host;
      smtpConfig.port = port;
      
      // Automatically set secure: false for STARTTLS ports (587, 25) unless secure is explicitly set
      const secureEnv = process.env.EMAIL_SECURE || process.env.SMTP_SECURE;
      if (secureEnv !== undefined) {
        smtpConfig.secure = secureEnv === 'false' ? false : true;
      } else {
        smtpConfig.secure = (port === 587 || port === 25) ? false : true;
      }
      console.log(`SMTP Transporter Secure option set to: ${smtpConfig.secure}`);
    } else {
      console.log('No SMTP_HOST specified in environment. Defaulting to standard Gmail service configuration (Pooled).');
      smtpConfig.service = 'gmail';
    }

    transporter = nodemailer.createTransport(smtpConfig);
    cachedTransporter = transporter;
    cachedCredentialsKey = credentialsKey;
  }

  const mailOptions = {
    from: `"AI Cold Mail Generator" <${user || 'no-reply@gmail.com'}>`,
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
