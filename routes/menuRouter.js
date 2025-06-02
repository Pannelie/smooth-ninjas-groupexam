import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// GET product to menu
router.get("/", async (req, res, next) => {
  const menu = await Product.find();
  if (menu && menu.length > 0) {
    console.log("Menu loaded successfully");
    res.json({ success: true, message: `Found menu`, menu });
  } else {
    next({ status: 400, message: "No menu found" });
  }
});

export default router;
