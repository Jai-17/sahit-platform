export function getVerificationEmail(name: string, email: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            color: #000000;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);
          }
          h1 {
            color: #8300EA;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #8300EA;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .footer {
            margin-top: 30px;
            font-size: 0.85em;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Verify Your Email</h1>
          <p>Hi ${name},</p>
          <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
          <a href="${process.env.BASE_URL}/api/v1/help/auth/verify-otp?code=${code}&email=${email}" class="btn">Verify Email</a>
          <p class="footer">If you didn't create an account, you can ignore this message.</p>
        </div>
      </body>
      </html>
    `;
  }
  