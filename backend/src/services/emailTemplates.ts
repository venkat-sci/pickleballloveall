// Email template styles matching your site's green theme
const emailStyles = `
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .tagline {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
      color: #374151;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #111827;
    }
    .message {
      font-size: 16px;
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-1px);
    }
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-link {
      display: inline-block;
      margin: 0 10px;
      color: #22c55e;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
      margin: 30px 0;
    }
    .features {
      display: flex;
      gap: 20px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    .feature {
      flex: 1;
      min-width: 150px;
      text-align: center;
      padding: 20px;
      background-color: #f0fdf4;
      border-radius: 8px;
      border: 1px solid #dcfce7;
    }
    .feature-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .feature-title {
      font-weight: 600;
      color: #16a34a;
      margin-bottom: 5px;
    }
    .feature-desc {
      font-size: 12px;
      color: #6b7280;
    }
  </style>
`;

export const createVerificationEmailTemplate = (
  name: string,
  verificationUrl: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - PickleballLoveAll</title>
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
      <div class="email-container">
        <div class="header">
          <div class="logo">
            🎾 PickleballLoveAll
          </div>
          <div class="tagline">Your Ultimate Pickleball Community</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hi ${name}! 👋</div>
          
          <div class="message">
            Welcome to PickleballLoveAll! We're excited to have you join our community of passionate pickleball players.
          </div>
          
          <div class="message">
            To complete your registration and start exploring tournaments, tracking matches, and connecting with other players, please verify your email address by clicking the button below:
          </div>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">
              ✅ Verify My Email
            </a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
          </div>
          
          <div class="divider"></div>
          
          <div class="message">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br><br>
            <a href="${verificationUrl}" style="color: #22c55e; word-break: break-all;">${verificationUrl}</a>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Need help? Contact us at support@pickleballloveall.com
          </div>
          <div class="footer-text">
            © 2025 PickleballLoveAll. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const createPasswordResetEmailTemplate = (
  name: string,
  resetUrl: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - PickleballLoveAll</title>
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
      <div class="email-container">
        <div class="header">
          <div class="logo">
            🎾 PickleballLoveAll
          </div>
          <div class="tagline">Your Ultimate Pickleball Community</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hi ${name}! 👋</div>
          
          <div class="message">
            We received a request to reset your password for your PickleballLoveAll account.
          </div>
          
          <div class="message">
            Click the button below to create a new password. This link is secure and will only work once:
          </div>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">
              🔒 Reset My Password
            </a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> This reset link will expire in 1 hour for your security. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          </div>
          
          <div class="divider"></div>
          
          <div class="message">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br><br>
            <a href="${resetUrl}" style="color: #22c55e; word-break: break-all;">${resetUrl}</a>
          </div>
          
          <div class="message" style="margin-top: 30px; padding: 16px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong>💡 Security Tips:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Choose a strong, unique password</li>
              <li>Don't share your password with anyone</li>
              <li>Consider using a password manager</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Need help? Contact us at support@pickleballloveall.com
          </div>
          <div class="footer-text">
            © 2025 PickleballLoveAll. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const createWelcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PickleballLoveAll! 🎾</title>
      ${emailStyles}
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
      <div class="email-container">
        <div class="header">
          <div class="logo">
            🎾 PickleballLoveAll
          </div>
          <div class="tagline">Your Ultimate Pickleball Community</div>
        </div>
        
        <div class="content">
          <div class="greeting">Welcome aboard, ${name}! 🎉</div>
          
          <div class="message">
            Congratulations! Your email has been verified and your PickleballLoveAll account is now active. You're all set to dive into the exciting world of competitive pickleball!
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
              🚀 Get Started
            </a>
          </div>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">🏆</div>
              <div class="feature-title">Join Tournaments</div>
              <div class="feature-desc">Find and register for tournaments in your area</div>
            </div>
            <div class="feature">
              <div class="feature-icon">📊</div>
              <div class="feature-title">Track Performance</div>
              <div class="feature-desc">Monitor your stats and rating progression</div>
            </div>
            <div class="feature">
              <div class="feature-icon">👥</div>
              <div class="feature-title">Connect</div>
              <div class="feature-desc">Meet other players and build your network</div>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="message">
            <strong>🎯 Quick Start Tips:</strong>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li><strong>Complete your profile:</strong> Add a photo and bio to connect with other players</li>
              <li><strong>Browse tournaments:</strong> Find upcoming events that match your skill level</li>
              <li><strong>Update your preferences:</strong> Set your availability and preferred playing times</li>
              <li><strong>Join the community:</strong> Engage with other players and organizers</li>
            </ul>
          </div>
          
          <div class="message" style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <strong>🎾 Pro Tip:</strong> Complete your profile to get personalized tournament recommendations and connect with players at your skill level!
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-text">
            Questions? We're here to help at support@pickleballloveall.com
          </div>
          <div class="footer-text">
            Follow us for updates and tips:
          </div>
          <div class="social-links">
            <a href="#" class="social-link">Facebook</a> |
            <a href="#" class="social-link">Twitter</a> |
            <a href="#" class="social-link">Instagram</a>
          </div>
          <div class="footer-text" style="margin-top: 20px;">
            © 2025 PickleballLoveAll. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
