const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden: Admins only" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = verifyAdmin;
