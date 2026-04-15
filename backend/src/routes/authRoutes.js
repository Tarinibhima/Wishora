const express = require("express");
const { signup, login, me, deleteAccount } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;
