const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authorizationHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. Token is required." });
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied. Token is required." });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
