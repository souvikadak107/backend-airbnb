const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validationResult } = require("express-validator");

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true only in HTTPS production
    maxAge: 5* 60 * 60 * 1000, // 5 hours
  });
}

exports.getSignup = (req, res) => {
  return res.status(200).json({
      message: "Signup API endpoint"
    });
}

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Validation failed", details: errors.array() });
    }

    const { firstName, lastName, email, password, usertype } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      usertype,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email, usertype: user.usertype },
    });
  } catch (err) {
    next(err);
  }
};


exports.getLogin = (req, res) => {
  return res.status(200).json({
      message: "Login API endpoint"
    });
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id.toString(), usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30m" }
    );

    setTokenCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, usertype: user.usertype },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};