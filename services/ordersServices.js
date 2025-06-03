import Order from '../models/order.js';
import Cart from '../models/cart.js';
import { generateOrderId } from '../utils/utils.js';

export async function createOrder(cartId) {
	try {
		const cart = await Cart.findOne({ cartId });
		if (!cart || cart.items.length === 0) {
			throw new Error('Cart not found or empty');
		}

		const totalPrice = cart.items.reduce((sum, item) => {
			return sum + item.price * item.qty;
		}, 0);

		let userId = null;
		if (global.user) {
			userId = cartId.replace(/^cart-/, 'user-');
		} else {
			userId = cartId.replace(/^cart-/, 'guest-');
		}

		console.log(totalPrice);

		const order = await Order.create({
			userId: userId,
			orderId: generateOrderId(),
			items: cart.items,
			totalPrice: totalPrice,
		});

		return order;
	} catch (error) {
		console.error(error.message);
		throw error;
	}
}

export async function getAllOrders() {
	try {
		const orders = await Order.find();
		return orders;
	} catch {
		console.error(error.message);
		throw error;
	}
}

export async function getOrderByUserId(userId) {
	return await Order.find({ userId });
}
