const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('./OTPController');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Cannot find user email' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
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
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData = {};
        const fields = ['name', 'email', 'phoneNumber', 'avatar', 'dob', 'gender'];
        
        fields.forEach(field => {
            if (updates[field] && updates[field] !== existingUser[field]) {
                updateData[field] = updates[field];
            }
        });

        if (updates.address) {
            updateData.address = {
                formattedAddress: updates.address.formattedAddress || existingUser.address?.formattedAddress,
                subregion: updates.address.subregion || existingUser.address?.subregion,
                region: updates.address.region || existingUser.address?.region,
                country: updates.address.country || existingUser.address?.country
            };
        }

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
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendOTP(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and new password are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Password reset successfully' 
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ 
            message: 'Failed to reset password',
            error: error.message 
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
