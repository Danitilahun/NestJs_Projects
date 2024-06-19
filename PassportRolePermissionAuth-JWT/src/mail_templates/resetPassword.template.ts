/* eslint-disable prettier/prettier */
export const  resetPasswordTemplate=(url:string)=>{

return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
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
        color: #333;
        text-align: center;
    }
    p {
        color: #666;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }
    .btn:hover {
        background-color: #0056b3;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Reset Your Password</h1>
    <p>You requested to reset your password. Click the button below to reset it:</p>
    <a href=${url} class="btn">Reset Password</a>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p>Thanks,<br>Your Company Name</p>
</div>
</body>
</html>
`};