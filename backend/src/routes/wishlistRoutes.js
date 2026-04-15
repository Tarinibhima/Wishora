const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createWishlist,
  getMyWishlists,
  addItem,
  getWishlistById,
  reserveItem
} = require("../controllers/wishlistController");

const router = express.Router();

router.get("/me", authMiddleware, getMyWishlists);
router.post("/", authMiddleware, createWishlist);
router.post("/:id/items", authMiddleware, addItem);
router.get("/:id", authMiddleware, getWishlistById);
router.patch("/:id/items/:itemId/reserve", authMiddleware, reserveItem);

module.exports = router;
