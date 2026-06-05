const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'mashruf.zaman@gmail.com',
      subject: 'Test Email from Server',
      text: 'This is a test email from cPanel server'
    });
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.log('❌ Email failed:', error.message);
  }
}

testEmail();
