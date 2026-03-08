'use strict';

const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

// ─── HTML template helpers ────────────────────────────────────────────────────

function baseTemplate(title, bodyHtml) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none; }
    a[x-apple-data-detectors] { font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
    body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; background-color: #000000; }
    table { border-collapse: collapse !important; }
    a { color: #1a82e2; }
  </style>
</head>
<body style="background-color:#000000;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
          <tr>
            <td align="center" valign="top" style="padding:36px 24px;">
              <a href="${config.client.url}" target="_blank" style="display:inline-block;">
                <img src="https://i.postimg.cc/CRMhY4xB/Screenshot-2023-07-22-194839.png" border="0" alt="FreeToWork" />
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${bodyHtml}
    <tr>
      <td align="center" bgcolor="#000000" style="padding:24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
          <tr>
            <td align="center" bgcolor="#000000" style="color:rgb(171,171,171);padding:12px 24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;">
              <p style="margin:0;">@FreeToWork</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function gradientSection(contentHtml) {
    return `
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%"
          style="background:linear-gradient(114.9deg,rgb(34,34,34) 8.3%,rgb(0,40,60) 41.6%,rgb(0,143,213) 93.4%);max-width:600px;">
          ${contentHtml}
        </table>
      </td>
    </tr>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send an email verification link to a newly registered user.
 * @param {string} toEmail
 * @param {string} verifyUrl  Full URL the user clicks to confirm their email
 */
exports.sendVerificationEmail = function sendVerificationEmail(toEmail, verifyUrl) {
    const body = gradientSection(`
      <tr>
        <td align="left" style="padding:36px 24px 0;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;">
          <h1 style="margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px;color:#fff;">
            Confirm Your Email Address
          </h1>
        </td>
      </tr>
      <tr>
        <td align="left" style="background:inherit;color:#ffffff;padding:24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;">
          <p style="margin:0;">Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.</p>
        </td>
      </tr>
      <tr>
        <td align="center" style="background:inherit;padding:12px;">
          <a href="${verifyUrl}" target="_blank"
            style="display:inline-block;padding:16px 36px;font-family:'Poppins',sans-serif;font-size:16px;color:#ffffff;text-decoration:none;border-radius:6px;background:#1a82e2;">
            Verify Email
          </a>
        </td>
      </tr>
      <tr>
        <td align="left" style="color:white;background:inherit;padding:24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;">
          <p style="margin:0;">If the button doesn't work, copy and paste this link:<br><a href="${verifyUrl}" style="color:#1a82e2;">${verifyUrl}</a></p>
        </td>
      </tr>
      <tr>
        <td align="left" style="color:white;background:inherit;padding:24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;">
          <p style="margin:0;">Cheers,<br>FreeToWork</p>
        </td>
      </tr>
    `);

    return transporter.sendMail({
        from: config.email.user,
        to: toEmail,
        subject: 'Verify your email — FreeToWork',
        html: baseTemplate('Email Verification', body),
    });
};

/**
 * Send a temporary password to a user who requested a reset.
 * @param {string} toEmail
 * @param {string} tempPassword  Plain-text temporary password
 */
exports.sendPasswordResetEmail = function sendPasswordResetEmail(toEmail, tempPassword) {
    const body = gradientSection(`
      <tr>
        <td align="left" style="padding:36px 24px 0;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;">
          <h1 style="margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px;color:#fff;">
            Password Reset
          </h1>
        </td>
      </tr>
      <tr>
        <td align="left" style="background:inherit;color:#ffffff;padding:24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;">
          <p style="margin:0;">Your password has been reset. Your new temporary password is:</p>
        </td>
      </tr>
      <tr>
        <td align="center" style="background:inherit;padding:12px;">
          <span style="display:inline-block;padding:16px 36px;font-family:'Poppins',sans-serif;font-size:20px;color:#ffffff;border-radius:6px;background:#1a82e2;letter-spacing:2px;">
            ${tempPassword}
          </span>
        </td>
      </tr>
      <tr>
        <td align="left" style="color:white;background:inherit;padding:24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;">
          <p style="margin:0;">Log in with this password, go to your profile, and change it immediately.</p>
        </td>
      </tr>
      <tr>
        <td align="left" style="color:white;background:inherit;padding:24px;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;">
          <p style="margin:0;">Cheers,<br>FreeToWork</p>
        </td>
      </tr>
    `);

    return transporter.sendMail({
        from: config.email.user,
        to: toEmail,
        subject: 'Password reset — FreeToWork',
        html: baseTemplate('Password Reset', body),
    });
};