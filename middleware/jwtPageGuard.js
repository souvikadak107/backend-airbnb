const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.usertype = decodedToken.usertype;
    if(req.usertype !== "host") {
      return res.redirect("/login");
    }
    return next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    return res.redirect("/login");
  }
}