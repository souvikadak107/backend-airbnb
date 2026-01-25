exports.cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,                  // true only on HTTPS
    sameSite: isProd ? "none" : "lax",
    maxAge: 300 * 60 * 1000,          // 5h (match your JWT)
  };
};