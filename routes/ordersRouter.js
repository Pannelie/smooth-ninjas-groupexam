import express from "express";
import { createOrder, getAllOrders, getOrderByUserId } from "../services/ordersServices.js";
import { removeCartById } from "../services/cartServices.js";
import { validateCartId, validateUserId } from "../middlewares/validators.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const result = await getAllOrders();
  if (result) {
    res.json({ success: true, orders: result });
  } else {
    return next({ status: 404, message: "No orders found" });
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

  const orders = await getOrderByUserId(userId);
  if (orders && orders.length > 0) {
    return res.json({ success: true, orders });
  } else {
    return next({
      status: 400,
      message: "No orders found for this user",
    });
  }
});

export default router;
