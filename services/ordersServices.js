import Order from '../models/order.js';
import Cart from '../models/cart.js';
import { generateOrderId } from '../utils/utils.js';

export async function createOrder(cartId) {
	try {
		const cart = await Cart.findOne({ cartId });
		if (!cart || cart.items.length === 0) {
			throw new Error('Cart not found or empty');
		}
		const order = await Order.create({
			userId: cartId,
			orderId: generateOrderId(),
			items: cart.items,
		});

		return order;
	} catch (error) {
		console.error(error.message);
		throw error;
	}
}
