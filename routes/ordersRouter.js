import express from 'express';
import {
	createOrder,
	getAllOrders,
	getOrderByUserId,
} from '../services/ordersServices.js';
import { emptyCartById } from '../services/cartServices.js';
import { validateCartId, validateUserId } from '../middlewares/validators.js';
import { fallbackService } from '../services/fallbackService.js';

const router = express.Router();

//GET all orders
router.get('/', async (req, res, next) => {
	const result = await getAllOrders();
	if (result) {
		return res.status(200).json({ success: true, orders: result });
	} else {
		return next({ status: 404, message: 'No orders found' });
	}
});

// Create order by cartId
router.post('/', validateCartId, async (req, res, next) => {
	const { cartId } = req.body;

	const order = await createOrder(cartId);
	if (order) {
		await emptyCartById(cartId);
		console.log(`Order created by user:${cartId}, their cart is emptied`);
		return res.status(201).json({ success: true, order });
	} else {
		return next({ status: 400, message: `Order could not be created` });
	}
});

//GET orders by userId
router.get('/:userId', validateUserId, async (req, res, next) => {
	const { userId } = req.params;

	const orders = await getOrderByUserId(userId);
	if (orders && orders.length > 0) {
		return res.status(200).json({ success: true, orders });
	} else {
		return next({
			status: 400,
			message: 'No orders found for this user',
		});
	}
});

// ==== FALLBACK ====
router.use(fallbackService);

export default router;
