const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password instead of regular password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter connection
transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP with 5 minutes expiry
        otpStore.set(email, {
            otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        // Send OTP via email
        const mailOptions = {
            from: `"MMA App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <h1 style="color: #28a745; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">${otp}</h1>
                    <p style="color: #6c757d;">This OTP will expire in 5 minutes.</p>
                    <p style="color: #dc3545; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ 
            message: 'Error sending OTP', 
            error: error.message,
            details: 'Please check email configuration and credentials'
        });
    }
};

// Export otpStore for middleware use
exports.otpStore = otpStore;