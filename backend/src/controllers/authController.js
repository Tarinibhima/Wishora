const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = (user) =>
  jwt.sign({ userId: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    return res.status(201).json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not create account" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Could not load profile" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Wishlist.deleteMany({ owner: userId });
    await Wishlist.updateMany(
      { "items.reservedBy": userId },
      { $set: { "items.$[item].reservedBy": null } },
      { arrayFilters: [{ "item.reservedBy": userId }] }
    );
    await User.findByIdAndDelete(userId);

    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete account" });
  }
};

module.exports = { signup, login, me, deleteAccount };
