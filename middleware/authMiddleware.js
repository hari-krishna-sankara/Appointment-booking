const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid token",
          success: false,
        });
      }

      req.user = decoded; // ✅ Set full user object from token
      next();
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).send({
      message: "Auth middleware error",
      success: false,
      error,
    });
  }
};
