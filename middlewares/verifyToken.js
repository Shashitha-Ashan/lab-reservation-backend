const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get the bearer token from the request headers
  const bearerToken = req.headers.authorization;

  // Check if the bearer token exists
  if (!bearerToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Extract the token from the bearer token string
    const token = bearerToken.split(" ")[1];

    // Verify the token using JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
