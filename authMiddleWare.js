const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
 
  if (!token) {
    return res.status(401).json("Access denied. Token is required.");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid token.");
  }
};

module.exports = authMiddleware;
