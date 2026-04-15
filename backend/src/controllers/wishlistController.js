const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");

const toClientWishlist = (wishlist) => ({
  id: wishlist._id,
  occasion: wishlist.occasion,
  owner: wishlist.owner,
  items: wishlist.items.map((item) => ({
    id: item._id,
    name: item.name,
    productLink: item.productLink,
    description: item.description,
    status: item.reservedBy ? "Taken" : "Available"
  })),
  createdAt: wishlist.createdAt
});

const createWishlist = async (req, res) => {
  const { occasion } = req.body;
  if (!occasion?.trim()) {
    return res.status(400).json({ message: "Occasion name is required" });
  }

  try {
    const wishlist = await Wishlist.create({
      occasion: occasion.trim(),
      owner: req.user.userId,
      items: []
    });
    return res.status(201).json({ wishlist: toClientWishlist(wishlist) });
  } catch (error) {
    return res.status(500).json({ message: "Could not create wishlist" });
  }
};

const getMyWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    return res.json({ wishlists: wishlists.map(toClientWishlist) });
  } catch (error) {
    return res.status(500).json({ message: "Could not load wishlists" });
  }
};

const addItem = async (req, res) => {
  const { id } = req.params;
  const { name, productLink, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Item name is required" });
  }

  try {
    const wishlist = await Wishlist.findOne({ _id: id, owner: req.user.userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items.push({
      name: name.trim(),
      productLink: productLink?.trim() ?? "",
      description: description?.trim() ?? ""
    });
    await wishlist.save();

    return res.status(201).json({ wishlist: toClientWishlist(wishlist) });
  } catch (error) {
    return res.status(500).json({ message: "Could not add item" });
  }
};

const getWishlistById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  try {
    const wishlist = await Wishlist.findById(id);
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.json({ wishlist: toClientWishlist(wishlist) });
  } catch (error) {
    return res.status(500).json({ message: "Could not load wishlist" });
  }
};

const reserveItem = async (req, res) => {
  const { id, itemId } = req.params;

  try {
    const wishlist = await Wishlist.findById(id);
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const item = wishlist.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (item.reservedBy) {
      return res.status(409).json({ message: "Item already reserved" });
    }

    item.reservedBy = req.user.userId;
    await wishlist.save();

    return res.json({ wishlist: toClientWishlist(wishlist) });
  } catch (error) {
    return res.status(500).json({ message: "Could not reserve item" });
  }
};

module.exports = { createWishlist, getMyWishlists, addItem, getWishlistById, reserveItem };
