exports.cookieOptions = () => {
  return {
    httpOnly: true,
    secure: true,                  // true only on HTTPS
    sameSite:"none",
    maxAge: 30 * 60 * 1000,          // 30 minutes (match your JWT)
  };
};