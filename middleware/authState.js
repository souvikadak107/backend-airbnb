const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.token;

  req.isLoggedIn = false;
  req.userId = null;
  req.usertype = null;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.usertype = decodedToken.usertype;
    req.isLoggedIn = true;
  } catch (err) {
    console.log("JWT verification failed:", err);
  }

  res.locals.isLoggedIn = req.isLoggedIn;
  res.locals.usertype = req.usertype;

  return next();
};