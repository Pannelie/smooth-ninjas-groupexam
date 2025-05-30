import express from 'express';
import { createOrder, getAllOrders, getOrderByUserId } from '../services/ordersServices.js';
import { removeCartById } from '../services/cartServices.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const result = await getAllOrders();
		if (!result) {
			return next({ status: 404, message: 'No orders found' });
		}
		res.json({ success: true, orders: result });
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { cartId } = req.body;
		if (!cartId) {
			return next({ status: 400, message: 'cartId is required' });
		}
		const order = await createOrder(cartId);
		const result = await removeCartById(cartId);
		console.log(`Order created by user:${cartId}, their cart is removed`);
		return res.status(201).json({ success: true, order });
	} catch (error) {
		console.error(error.message);
		next (error)
	}
});

router.get('/:userId', async (req, res, next) => {
	const { userId } = req.params;
	
	if (!userId) {
		return next({ status: 400, success: false, message: 'userId is required' });
	}

	try {
		const orders = await getOrderByUserId(userId);
		if (orders.length === 0) {
			return next({ status: 400, success: false, message: 'No orders found for this user' });
		}
		return res.json({ success: true, orders });
	} catch (error) {
		console.error(error.message);
		next(error);
	}
});

export default router;
