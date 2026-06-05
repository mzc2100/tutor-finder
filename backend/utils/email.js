const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || smtp.gmail.com,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || "mashruf.zaman@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "gbuk aftz ruci avqz"
    }
  });
};

// Send email notification for new provider registration
const sendRegistrationEmail = async (registrationData) => {
  const transporter = createTransporter();
  
  const { full_name, mobile_number, address, category, reference_number, other_notes, created_at } = registrationData;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: 'mashruf.zaman@gmail.com',
    subject: `New Provider Registration - ${full_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
          }
          .field {
            margin-bottom: 15px;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .value {
            margin-left: 10px;
          }
          .footer {
            text-align: center;
            padding: 15px;
            color: #777;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🎉 New Provider Registration</h2>
        </div>
        <div class="content">
          <p>A new provider has registered on your platform. Here are the details:</p>
          
          <div class="field">
            <span class="label">Full Name:</span>
            <span class="value">${full_name}</span>
          </div>
          
          <div class="field">
            <span class="label">Mobile Number:</span>
            <span class="value">${mobile_number}</span>
          </div>
          
          <div class="field">
            <span class="label">Address:</span>
            <span class="value">${address || 'N/A'}</span>
          </div>
          
          <div class="field">
            <span class="label">Category:</span>
            <span class="value">${category || 'N/A'}</span>
          </div>
          
          <div class="field">
            <span class="label">Reference Number:</span>
            <span class="value">${reference_number || 'N/A'}</span>
          </div>
          
          <div class="field">
            <span class="label">Other Notes:</span>
            <span class="value">${other_notes || 'N/A'}</span>
          </div>
          
          <div class="field">
            <span class="label">Registration Time:</span>
            <span class="value">${created_at}</span>
          </div>
          
          <p style="margin-top: 20px; padding: 10px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
            <strong>Action Required:</strong> Please review and approve this registration in your admin panel.
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email sent from Tutor Finder Platform</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending registration email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationEmail
};