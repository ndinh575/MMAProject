const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyOTP } = require('./OTPController');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const users = await User.find();

        // Find the user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Cannot find user email' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token: token });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber, address, avatar, createdDate, dob, gender } = req.body;

        // Create a new user
        const user = new User({ 
            name, 
            email, 
            password, 
            role, 
            phoneNumber, 
            address, 
            avatar, 
            createdDate,
            dob,
            gender
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;
        const { dob, gender } = updates;

        // Find existing user first
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Build update object with only changed fields
        const updateData = {};
        if (updates.name && updates.name !== existingUser.name) updateData.name = updates.name;
        if (updates.email && updates.email !== existingUser.email) updateData.email = updates.email;
        if (updates.phoneNumber && updates.phoneNumber !== existingUser.phoneNumber) updateData.phoneNumber = updates.phoneNumber;
        if (updates.avatar && updates.avatar !== existingUser.avatar) updateData.avatar = updates.avatar;
        if (dob && new Date(dob).toString() !== new Date(existingUser.dob).toString()) updateData.dob = dob;
        if (gender && gender !== existingUser.gender) updateData.gender = gender;

        // Handle address updates
        if (updates.address) {
            updateData.address = {
                formattedAddress: updates.address.formattedAddress || existingUser.address?.formattedAddress,
                subregion: updates.address.subregion || existingUser.address?.subregion,
                region: updates.address.region || existingUser.address?.region,
                country: updates.address.country || existingUser.address?.country
            };
        }

        // Only update if there are changes
        if (Object.keys(updateData).length === 0) {
            return res.json(existingUser);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Duplicate field value entered',
                field: Object.keys(error.keyPattern)[0]
            });
        }
        
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate and send OTP
        await sendOTP(req, res);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Verify OTP first
        const otpVerification = await verifyOTP({ body: { email, otp } }, { 
            status: (code) => ({
                json: (data) => ({ code, data })
            })
        });

        if (otpVerification.code !== 200) {
            return res.status(400).json(otpVerification.data);
        }

        // Find user and update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
