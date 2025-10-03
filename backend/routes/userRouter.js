const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getAllUsers,
  userSignup,
  userLogin,
  verifyToken,
} = require("../controllers/userController");

router.get("/", requireAuth, getAllUsers);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/verify", verifyToken);

module.exports = router;
