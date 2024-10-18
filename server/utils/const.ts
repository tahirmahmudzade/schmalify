export const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function getPasswordResetHtmlContent(resetToken: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #dddddd;
    }
    .header h2 {
      color: #333333;
      font-size: 24px;
      margin: 0;
    }
    .content {
      padding: 20px 0;
      color: #555555;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .token {
      display: inline-block;
      background-color: #f4f4f4;
      border-radius: 4px;
      padding: 10px;
      font-size: 16px;
      font-family: monospace;
      color: #333333;
      word-break: break-all;
    }
    .footer {
      padding-top: 20px;
      border-top: 1px solid #dddddd;
      text-align: center;
      font-size: 12px;
      color: #aaaaaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Please copy the token below and paste it into the password reset form:</p>
      <p class="token">${resetToken}</p>
      <p>If you did not request this, please ignore this email. The token will expire in 5 minutes.</p>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to contact us at support@example.com.</p>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
}
