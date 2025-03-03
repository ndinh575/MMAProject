const mongoose = require('mongoose');

// Định nghĩa Schema User
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true},
    email: { type: String, required: true, unique: true  },
    phoneNumber: { type: String, required: true, unique: true  },
    address: { type: String, required: true },
    avatar: { type: String},
});

module.exports = mongoose.model('User', UserSchema, 'Users');
