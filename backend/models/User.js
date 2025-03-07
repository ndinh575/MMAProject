const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String, // Path to uploaded profile image
      default: "/uploads/default-avatar.png",
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  }
);

// Hash Password Before Saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare Password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export User Model
const User = mongoose.model("User", UserSchema);
module.exports = User;
