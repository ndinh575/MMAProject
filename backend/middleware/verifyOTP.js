const { otpStore } = require('../controllers/OTPController');

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Validate required fields
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Get stored OTP data
        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }

        // Check if OTP has expired
        const isExpired = Date.now() > storedData.expiry;
        if (isExpired) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Verify OTP matches
        const isValidOTP = storedData.otp === otp;
        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear verified OTP
        otpStore.delete(email);

        // Attach verification status to request
        req.otpVerified = true;
        req.verifiedEmail = email;  // Store the verified email
        
        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ 
            message: 'Error verifying OTP',
            error: error.message 
        });
    }
};

module.exports = verifyOTP; 