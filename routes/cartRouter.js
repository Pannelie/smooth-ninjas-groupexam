import express, { json } from "express";
import { getProduct } from "../services/productServices.js";
import { getAllCarts, getCartByCartId, updateCart, campaignCartFree } from "../services/cartServices.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await getAllCarts();
  if (result) return res.json({ success: true, carts: result });
  else res.status(400).json({ message: "Server error" });
});

// GET cart by cartId, ändra cartId så de heter cart-xxxxx? kan baseras på userId-xxxxx med substring förslagsvis
router.get("/:cartId", async (req, res, next) => {
  const cartId = req.params.cartId;

  if (!cartId) {
    return next({ status: 400, message: `Missing cart ID in request – cannot fetch cart for ${global.user?.username || "guest"}` });
  }

  console.log(cartId);

  const cart = await getCartByCartId(cartId);
  if (cart && cart.length > 0) {
    return res.status(200).json({ success: true, message: `Fetched cart for ${global.user?.username || "guest"}`, cart });
  } else {
    return next({ status: 404, message: `No cart found for ${global.user?.username || "guest"}` });
  }
});

// PUT /api/cart
// -  Creates a new cart if we have a logged in user without a cart.
// or Adds the item to the cart if we have a cart from before
// If its a guest we create a new cart if teh guests sends in its guestId in hte body
// But if no guestId is sent with the PUT we create a new cart and guest with new id:s for both and send this back
router.put("/", async (req, res, next) => {
  if (!req.body) {
    return next ({status: 400, message: "No request body provided" });
  }

  if (global.user) {
    const { prodId, qty } = req.body;
    if (!prodId || typeof qty !== "number") {
      return next ({status: 400, message: "prodId and qty are required" });
    }
    const product = await getProduct(prodId);
    if (!product) {
      return next ({status: 404, message: "Product not found" });
    }
    const result = await updateCart(global.user.userId, {
      prodId: prodId,
      price: product.price,
      qty: qty,
    });
    return res.status(201).json({ success: true, cart: result });
  } else {
    let { guestId, prodId, qty } = req.body;
    if (!prodId || typeof qty !== "number") {
      return next ({status: 404, message: "prodId and qty are required" });
    }
    const product = await getProduct(prodId);
    if (!product) {
      return next ({status: 404, message: "prodId and qty are required" });
    }
    // Om det inte finns något guestId medskickat i body - skapa ett!
    if (!guestId) {
      guestId = `guest-${uuid().substring(0, 5)}`;
    }
    const result = await updateCart(guestId, {
      prodId: prodId,
      price: product.price,
      qty: qty,
    });
    return res.status(201).json({ success: true, guestId: guestId, cart: result });
  }
});

router.get("/:userId/campaign", async (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    return next({ status: 400, message: "Missing user ID in request" });
  }

  try {
    const result = await campaignCartFree(userId);
    if (result) {
      return res.status(200).json({ success: true, message: `Campaign applied for user ${userId}`, cart: result });
    } else {
      return next({ status: 404, message: `No cart found for user ${userId}` });
    }
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

export default router;
