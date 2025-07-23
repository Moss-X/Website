import Product from "../models/product.model.js";
import Bundle from "../models/bundle.model.js";
import Collection from "../models/collection.model.js";

const MODEL_MAP = {
  product: Product,
  bundle: Bundle,
  collection: Collection,
};

export const getCartProducts = async (req, res) => {
  try {
    const cartItems = await Promise.all(
      req.user.cartItems.map(async (item) => {
        const Model = MODEL_MAP[item.type];
        if (!Model) return null;
        const doc = await Model.findById(item.ref);
        if (!doc) return null;
        return {
          ...doc.toJSON(),
          quantity: item.quantity,
          type: item.type,
        };
      })
    );
    res.json(cartItems.filter(Boolean));
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { refId, type } = req.body;
    const user = req.user;
    if (!refId || !type || !MODEL_MAP[type])
      return res.status(400).json({ message: "Invalid cart item type or refId" });
    const existingItem = user.cartItems.find((item) => item.ref.equals(refId) && item.type === type);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ ref: refId, type, quantity: 1 });
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { refId, type } = req.body;
    const user = req.user;
    if (!refId || !type) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => !(item.ref.equals(refId) && item.type === type));
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { refId, type, quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.ref.equals(refId) && item.type === type);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => !(item.ref.equals(refId) && item.type === type));
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
