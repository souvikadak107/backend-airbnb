const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: token missing" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId).select("-password");
    if (!user) return res.status(401).json({ error: "Unauthorized: user not found" });

    req.user = user; // controller will use this
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized: invalid/expired token" });
  }
};