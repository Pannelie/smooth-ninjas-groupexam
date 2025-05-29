import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Items i cart ska se ut såhär
const cartItemSchema = new Schema({
	prodId: String,
	price: Number,
	qty: Number,
});

// Alla users cart ska se ut såhär och cartId är samma som UserId
const cartSchema = new Schema({
	cartId: {
		type: String,
		default: null,
	},
	items: [cartItemSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
