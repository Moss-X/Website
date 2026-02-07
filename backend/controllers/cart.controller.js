import Product from '../models/product.model.js';
import Bundle from '../models/bundle.model.js';
import Collection from '../models/collection.model.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import GuestCart from '../models/guestCart.model.js';

const MODEL_MAP = {
  product: Product,
  bundle: Bundle,
  collection: Collection,
};

const getOrCreateGuestCart = async (sessionId) => {
  console.log('getOrCreateGuestCart called with sessionId:', sessionId);
  let guestCart = await GuestCart.findOne({ sessionId });
  if (!guestCart) {
    console.log('Creating new guest cart for sessionId:', sessionId);
    guestCart = new GuestCart({ sessionId });
    await guestCart.save();
  } else {
    console.log(
      'Found existing guest cart with items:',
      guestCart.items.length
    );
  }
  return guestCart;
};

const getCartItems = async (user, sessionId) => {
  console.log('getCartItems called with:', {
    user: user ? user._id : 'guest',
    sessionId,
  });

  if (user) {
    console.log('Getting cart items for authenticated user');
    const cartItems = await Promise.all(
      user.cartItems.map(async (item) => {
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
    const filteredItems = cartItems.filter(Boolean);
    console.log('User cart items:', filteredItems.length);
    return filteredItems;
  } else {
    console.log('Getting cart items for guest user');
    const guestCart = await GuestCart.findOne({ sessionId });
    if (!guestCart) {
      console.log('No guest cart found, returning empty array');
      return [];
    }

    const cartItems = await Promise.all(
      guestCart.items.map(async (item) => {
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
    const filteredItems = cartItems.filter(Boolean);
    console.log('Guest cart items:', filteredItems.length);
    return filteredItems;
  }
};

export const getCartProducts = async (req, res) => {
  console.log('getCartProducts called with:', {
    user: req.user ? req.user._id : 'guest',
    sessionId: req.cookies.sessionId || req.headers['x-session-id'],
    cookies: req.cookies,
    headers: req.headers,
  });

  try {
    let effectiveUser = req.user;

    if (!effectiveUser && req.cookies?.accessToken) {
      const token = req.cookies.accessToken;
      try {
        if (process.env.JWT_SECRET) {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          if (payload?.userId) {
            const dbUser = await User.findById(payload.userId);
            if (dbUser) effectiveUser = dbUser;
          }
        } else {
          const payload = jwt.decode(token);
          if (payload?.userId) {
            const dbUser = await User.findById(payload.userId);
            if (dbUser) effectiveUser = dbUser;
          }
        }
      } catch (e) {
        console.log('Self-auth in getCartProducts failed:', e.message);
        const payload = jwt.decode(token);
        if (payload?.userId) {
          const dbUser = await User.findById(payload.userId);
          if (dbUser) effectiveUser = dbUser;
        }
      }
    }

    let cartItems = [];
    if (effectiveUser) {
      const dbUser = await User.findById(effectiveUser._id);
      console.log(
        'Authenticated request. Ignoring session header. User:',
        dbUser?._id
      );
      cartItems = await getCartItems(dbUser, null);
    } else {
      const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
      console.log('Guest request. Using session ID:', sessionId);
      cartItems = await getCartItems(null, sessionId);
    }
    console.log('Cart items retrieved:', cartItems.length);

    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json(cartItems);
  } catch (error) {
    console.log('Error in getCartProducts controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { refId, type } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (!refId || !type || !MODEL_MAP[type]) {
      return res
        .status(400)
        .json({ message: 'Invalid cart item type or refId' });
    }

    if (req.user) {
      const user = req.user;
      const existingItem = user.cartItems.find(
        (item) => item.ref.equals(refId) && item.type === type
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cartItems.push({ ref: refId, type, quantity: 1 });
      }
      await user.save();
      res.json(user.cartItems);
    } else {
      if (!sessionId) {
        return res
          .status(400)
          .json({ message: 'Session ID required for guest cart' });
      }

      const guestCart = await getOrCreateGuestCart(sessionId);
      const existingItem = guestCart.items.find(
        (item) => item.ref.equals(refId) && item.type === type
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.items.push({ ref: refId, type, quantity: 1 });
      }

      await guestCart.save();
      res.json(guestCart.items);
    }
  } catch (error) {
    console.log('Error in addToCart controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { refId, type } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (req.user) {
      const user = req.user;
      if (!refId || !type) {
        user.cartItems = [];
      } else {
        user.cartItems = user.cartItems.filter(
          (item) => !(item.ref.equals(refId) && item.type === type)
        );
      }
      await user.save();
      res.json(user.cartItems);
    } else {
      if (!sessionId) {
        return res
          .status(400)
          .json({ message: 'Session ID required for guest cart' });
      }

      const guestCart = await GuestCart.findOne({ sessionId });
      if (!guestCart) {
        return res.json([]);
      }

      if (!refId || !type) {
        guestCart.items = [];
      } else {
        guestCart.items = guestCart.items.filter(
          (item) => !(item.ref.equals(refId) && item.type === type)
        );
      }

      await guestCart.save();
      res.json(guestCart.items);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { refId, type, quantity } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    if (req.user) {
      const user = req.user;
      const existingItem = user.cartItems.find(
        (item) => item.ref.equals(refId) && item.type === type
      );
      if (existingItem) {
        if (quantity === 0) {
          user.cartItems = user.cartItems.filter(
            (item) => !(item.ref.equals(refId) && item.type === type)
          );
          await user.save();
          return res.json(user.cartItems);
        }
        existingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems);
      } else {
        res.status(404).json({ message: 'Cart item not found' });
      }
    } else {
      if (!sessionId) {
        return res
          .status(400)
          .json({ message: 'Session ID required for guest cart' });
      }

      const guestCart = await GuestCart.findOne({ sessionId });
      if (!guestCart) {
        return res.status(404).json({ message: 'Guest cart not found' });
      }

      const existingItem = guestCart.items.find(
        (item) => item.ref.equals(refId) && item.type === type
      );
      if (existingItem) {
        if (quantity === 0) {
          guestCart.items = guestCart.items.filter(
            (item) => !(item.ref.equals(refId) && item.type === type)
          );
          await guestCart.save();
          return res.json(guestCart.items);
        }
        existingItem.quantity = quantity;
        await guestCart.save();
        res.json(guestCart.items);
      } else {
        res.status(404).json({ message: 'Cart item not found' });
      }
    }
  } catch (error) {
    console.log('Error in updateQuantity controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const mergeGuestCart = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
    if (!sessionId) {
      return res.json({ message: 'No guest cart to merge' });
    }

    const guestCart = await GuestCart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return res.json({ message: 'No guest cart items to merge' });
    }

    const user = req.user;

    for (const guestItem of guestCart.items) {
      const existingItem = user.cartItems.find(
        (item) => item.ref.equals(guestItem.ref) && item.type === guestItem.type
      );
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        user.cartItems.push({
          ref: guestItem.ref,
          type: guestItem.type,
          quantity: guestItem.quantity,
        });
      }
    }

    await user.save();

    await GuestCart.findOneAndDelete({ sessionId });

    res.json({
      message: 'Guest cart merged successfully',
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.log('Error in mergeGuestCart controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
