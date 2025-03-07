const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @route   POST /api/login
 * @desc    Login a user
 * @access  Private
 */
exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const users = await User.find();

        // Find the user by username
        const user = users.find(u => u.name === name);

        if (!user) {
            return res.status(401).json({ message: 'Cannot find user name' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,   // Prevent access from JavaScript
            secure: false,     // Use only in HTTPS, set to false when in development to test in thunder client 
            sameSite: "Strict", // Prevent CSRF attacks
        });
        res.json({ message: 'Login successful', token: token });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @route   POST /api/logout
 * @desc    Logout a user
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: true, // Use in production with HTTPS
            sameSite: "Strict",
            expires: new Date(0) // Expire the cookie immediately
        });
        res.status(200).json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber, address, avatar, createdDate } = req.body;

        // Create a new user
        const user = new User({ name, email, password, role, phoneNumber, address, avatar, createdDate });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Private
 */
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, role } = req.body;

        const user = await User.findByIdAndUpdate(req.params.id, { name, email, phoneNumber, role }, { new: true }).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
