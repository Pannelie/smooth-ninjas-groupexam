import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Items i cart ska se ut såhär
const cartItemSchema = new Schema({
  prodId: { type: String, required: true },
  price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
  qty: { type: Number, required: true },
});

// Alla users cart ska se ut såhär och cartId är samma som UserId
const cartSchema = new Schema({
  cartId: {
    type: String,
    default: null,
    required: true,
    unique: true,
  },
  items: { type: [cartItemSchema], default: [], required: true },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
