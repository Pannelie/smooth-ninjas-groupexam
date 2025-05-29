import express from 'express';
import { getProduct } from '../services/productServices.js';
import { updateCart } from '../services/cartServices.js';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.put('/', async (req, res) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ success: false, message: 'No request body provided' });
	}

	if (global.user) {
		const { prodId, qty } = req.body;
		if (!prodId || !qty) {
			return res.status(400).json({
				success: false,
				message: 'prodId and qty are required',
			});
		}
		const product = await getProduct(prodId);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}
		const result = await updateCart(global.user.userId, {
			prodId: prodId,
			price: product.price,
			qty: qty,
		});
		return res.json({ success: true, cart: result });
	} else {
		let { guestId, prodId, qty } = req.body;
		if (!prodId || typeof qty !== 'number') {
			return res.status(400).json({
				success: false,
				message: 'prodId and qty are required',
			});
		}
		const product = await getProduct(prodId);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}
		if (!guestId) {
			guestId = `guest-${uuid().substring(0, 5)}`;
		}
		const result = await updateCart(guestId, {
			prodId: prodId,
			price: product.price,
			qty: qty,
		});
		return res.json({ success: true, guestId: guestId, cart: result });
	}
});

export default router;
