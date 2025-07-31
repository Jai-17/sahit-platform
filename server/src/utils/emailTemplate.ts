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

export function getNGOApprovalEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>NGO Approved</title>
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
        <h1>You're Approved!</h1>
        <p>Hi ${name},</p>
        <p>We're excited to let you know that your NGO account has been approved by our team.</p>
        <p>You can now start accessing the Sahit platform, view requests, and support those in need.</p>
        <a href="${process.env.NGO_CLIENT_BASE_URL}" class="btn">Go to Dashboard</a>
        <p class="footer">If you have any questions or need support, feel free to reach out to us.</p>
      </div>
    </body>
    </html>
  `;
}

export function getUserApprovedByAdminEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Account Approved</title>
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
        <h1>Your Account Has Been Approved</h1>
        <p>Hi ${name},</p>
        <p>Your profile has been successfully reviewed and approved by our team.</p>
        <p>You can now log in to Sahit and start raising help requests or tracking your progress.</p>
        <a href="${process.env.USER_CLIENT_BASE_URL}/sign-in" class="btn">Log In to Sahit</a>
        <p class="footer">If you did not apply for an account on Sahit, you can ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}

export function getHelpRequestApprovalByNGOEmail(name: string, ngoName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Request Approved</title>
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
        <h1>Your Request Has Been Accepted</h1>
        <p>Hi ${name},</p>
        <p>Good news! Your help request has been accepted by <strong>${ngoName}</strong>.</p>
        <p>The NGO team will reach out to you soon to provide assistance and further guidance.</p>
        <p class="footer">You can also track your request status anytime from your Sahit dashboard.</p>
      </div>
    </body>
    </html>
  `;
}

export function getNgoNewHelpRequestEmail(ngoName: string, requesterName: string, requestId: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Help Request</title>
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
        <h1>New Help Request Alert</h1>
        <p>Hi ${ngoName},</p>
        <p>You’ve received a new help request from <strong>${requesterName}</strong>.</p>
        <p>Please review the request and respond as soon as possible.</p>
        <a href="${process.env.NGO_CLIENT_BASE_URL}" class="btn">View Request</a>
        <p class="footer">You are receiving this notification because you're listed as an NGO on the Sahit platform.</p>
      </div>
    </body>
    </html>
  `;
}

export function getNgoMatchConfirmedEmail(ngoName: string, userName: string, requestId: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Help Match Confirmed</title>
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
        <h1>A User Accepted Your Help Offer</h1>
        <p>Hi ${ngoName},</p>
        <p>Good news! <strong>${userName}</strong> has accepted your offer to help.</p>
        <p>You can now view their request details and begin providing assistance.</p>
        <a href="${process.env.BASE_URL}/ngo/requests/${requestId}" class="btn">View Request</a>
        <p class="footer">Thank you for making a difference with Sahit.</p>
      </div>
    </body>
    </html>
  `;
}
