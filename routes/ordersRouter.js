import express from "express";
import { createOrder, getAllOrders, getOrderByUserId } from "../services/ordersServices.js";
import { removeCartById } from "../services/cartServices.js";
import { validateCartId, validateUserId } from "../middlewares/validators.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await getAllOrders();
    if (!result) {
      return next({ status: 404, message: "No orders found" });
    }
    res.json({ success: true, orders: result });
  } catch (error) {
    next(error);
  }
});

// this creates a order from a cart
router.post("/", validateCartId, async (req, res, next) => {
  const { cartId } = req.body;

  const order = await createOrder(cartId);
  if (order) {
    await removeCartById(cartId);
    console.log(`Order created by user:${cartId}, their cart is removed`);
    return res.status(201).json({ success: true, order });
  } else {
    next({ status: 400, message: `Order could not be created` });
  }
});

router.get("/:userId", validateUserId, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const orders = await getOrderByUserId(userId);
    if (orders.length === 0) {
      return next({
        status: 400,
        message: "No orders found for this user",
      });
    }
    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

export default router;
