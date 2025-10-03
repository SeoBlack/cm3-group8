const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  userSignup,
  userLogin,
  verifyToken,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/verify", verifyToken);

module.exports = router;
