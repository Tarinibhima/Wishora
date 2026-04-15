const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    productLink: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

const wishlistSchema = new mongoose.Schema(
  {
    occasion: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [wishlistItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
