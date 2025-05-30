import express from 'express';
import { createOrder, getAllOrders } from '../services/ordersServices.js';
import { removeCartById } from '../services/cartServices.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const result = await getAllOrders();
	if (result) return res.json({ success: true, orders: result });
	else res.status(400).json({ success: false, message: 'Server error' });
});

router.post('/', async (req, res) => {
	try {
		const { cartId } = req.body;
		if (!cartId) {
			return res
				.status(400)
				.json({ success: false, message: 'cartId is required' });
		}
		const order = await createOrder(cartId);
		const result = await removeCartById(cartId);
		console.log(`Order created by user:${cartId}, their cart is removed`);
		return res.status(201).json({ success: true, order });
	} catch (error) {
		console.error(error.message);
		return res.status(400).json({ success: false, message: error.message });
	}
});

export default router;
