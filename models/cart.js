import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  prodId: { type: String, required: true },
  price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
  qty: { type: Number, required: true },
});

const cartSchema = new Schema({
  cartId: {
    type: String,
    default: null,
    required: true,
    unique: true,
  },
  items: { type: [cartItemSchema], default: [], required: true },
  totalPrice: { type: Number, required: true, min: [0, "Total price cannot be negative"] },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
