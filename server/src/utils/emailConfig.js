import nodemailer from 'nodemailer'

console.log('Email configuration loading...');

// Check if email credentials are set
if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
  console.error('⚠️ WARNING: EMAIL or EMAIL_PASSWORD environment variables are not set!');
  console.error('Email functionality will not work correctly without these variables.');
} else {
  console.log(`Email configuration using: ${process.env.EMAIL}`);
}

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Debug options
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('⚠️ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server connection established and ready to send emails');
  }
});


  