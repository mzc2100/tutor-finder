# Email Notification Setup Guide

This document explains how to configure email notifications for new provider registrations.

## Overview

When a new provider registers on the platform, an email notification is automatically sent to `mashruf.zaman@gmail.com` with all the registration details.

## Prerequisites

- A Gmail account (mashruf.zaman@gmail.com)
- 2-Step Verification enabled on your Google Account
- Node.js and npm installed

## Setup Instructions

### 1. Create a Google App Password

Since 2022, Google requires App Passwords for third-party email applications:

1. **Sign in to your Google Account**
   - Go to https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Find "2-Step Verification" and click on it
   - Follow the instructions to set it up
   - You'll need your phone for this step

3. **Generate an App Password**
   - After enabling 2FA, go back to the Security page
   - Look for "App passwords" (it's under the "Signing in to Google" section)
   - Click on "App passwords"
   - You may need to sign in again

4. **Create the Password**
   - Under "Select app", choose "Mail"
   - Under "Select device", choose "Other (Custom name)"
   - Enter a name like "Tutor Finder Backend"
   - Click "GENERATE"

5. **Copy the Password**
   - Google will generate a 16-character password (example: `abcd efgh ijkl mnop`)
   - **Copy this immediately** - you won't see it again!
   - Note: You can use it with or without spaces

### 2. Configure the Environment Variables

1. **Copy the example environment file**:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit the `.env` file** and update the email configuration:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=mashruf.zaman@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password_here
   EMAIL_FROM=mashruf.zaman@gmail.com
   ```

3. **Update database configuration** (if needed):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=tutor_finder
   ```

### 3. Verify Installation

Ensure that nodemailer is installed:
```bash
cd backend
npm install nodemailer
```

### 4. Test the Setup

Start the backend server:
```bash
npm start
```

Then submit a test registration through the frontend. You should receive an email at `mashruf.zaman@gmail.com` with the registration details.

## Email Content

The email notification includes:
- Provider's full name
- Mobile number
- Address
- Category
- Reference number
- Other notes
- Registration timestamp

## Troubleshooting

### Email Not Sending

1. **Check the console logs** for error messages
2. **Verify your App Password** is correct
3. **Make sure 2-Step Verification is enabled** on your Google Account
4. **Check your Gmail spam folder**

### Authentication Error

If you see authentication errors:
- Double-check the EMAIL_PASSWORD in `.env`
- Make sure you're using an App Password, not your regular password
- Try regenerating the App Password

### Connection Timeout

If connection times out:
- Check your internet connection
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Make sure your firewall allows SMTP traffic

## Security Notes

- Never commit the `.env` file to version control
- The `.gitignore` file has been configured to ignore `.env`
- App Passwords are specific to your Google Account and can be revoked at any time
- Rotate your App Password periodically for better security

## How It Works

1. When a new provider registration is submitted, the `POST /backend/provider-registrations` endpoint saves the data to the database
2. After saving, it calls `sendRegistrationEmail()` function from `utils/email.js`
3. The email is sent asynchronously using nodemailer
4. The registration response is returned to the client without waiting for the email to complete
5. If email sending fails, an error is logged but the registration is still saved

## Customization

To change the email recipient, edit the `to` field in `backend/utils/email.js`:
```javascript
to: 'mashruf.zaman@gmail.com', // Change this to your desired email
```

To customize the email template, modify the HTML in the `sendRegistrationEmail()` function in `backend/utils/email.js`.