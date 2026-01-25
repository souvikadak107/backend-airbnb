const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const role = req.user?.usertype;
  if (!role) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (role !== "host") {
    return res.status(403).json({ error: "Forbidden: host access only" });
  }

  next();
};