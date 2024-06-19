/* eslint-disable prettier/prettier */
export const verifyAccountTemplate = (activationCode: string, token: string) => {

const html = `
 <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #007bff;
      text-align: center;
    }
    p {
      color: #333;
      font-size: 16px;
      line-height: 1.5;
      text-align: center;
    }
    .code {
      color: #0056b3;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-top: 20px;
    }
  </style>
  </head>
 <body>
    <div class="container">
      <h1>Email Verification</h1>
      <p>Thank you for signing up! To complete your registration, please use the code below to verify your email address:</p>
      <div class="code">copy this code ${activationCode}</div>
      <a href="https://letter-tracking-frontend.vercel.app/activation-account?token=${token}">Click Here to Verify our Account</a>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
    </div>
 </body>
 </html>
  `;
  return html;
}
