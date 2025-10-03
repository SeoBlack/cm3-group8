const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    //   console.log(authorization);
    //   console.log(authorization.split(" "));
    //   console.log(authorization.split(" ")[0]);
    //   console.log(authorization.split(" ")[1]);

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET);

    req.user = await User.findById(decoded._id).select("_id");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
