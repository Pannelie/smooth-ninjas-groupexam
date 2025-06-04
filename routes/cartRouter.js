import express, { json } from 'express';
import { getProduct } from '../services/productServices.js';
import {
	getAllCarts,
	getCartByCartId,
	updateCart,
	campaignCartFree,
} from '../services/cartServices.js';
import { v4 as uuid } from 'uuid';
import { validateProductBody } from '../middlewares/validators.js';
import { validateUserId } from '../middlewares/validators.js';
import { fallbackService } from '../services/fallbackService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
	const result = await getAllCarts();
	if (result) {
		return res.status(200).json({ success: true, carts: result });
	} else {
		return next({ status: 404, message: 'Server error' });
	}
});

// GET cart by cartId
router.get('/:cartId', async (req, res, next) => {
	const cartId = req.params.cartId;

	if (!cartId) {
		return next({
			status: 400,
			message: `Missing cart ID in request – cannot fetch cart for ${
				global.user?.username || 'guest'
			}`,
		});
	}

	console.log(cartId);

	const cart = await getCartByCartId(cartId);
	if (cart) {
		const totalPrice = cart.items.reduce((sum, item) => {
			return sum + item.price * item.qty;
		}, 0);

		return res.status(200).json({
			success: true,
			message: `Fetched cart for ${global.user?.username || 'guest'}`,
			cart,
			totalPrice,
		});
	} else {
		return next({
			status: 404,
			message: `No cart found for ${global.user?.username || 'guest'}`,
		});
	}
});

// Uppdate cart
router.put('/', validateProductBody, async (req, res, next) => {
	const { prodId, qty } = req.body;
	const product = await getProduct(prodId);

	if (!product) {
		return next({ status: 400, message: `Products not found` });
	}

	if (global.user) {
		const result = await updateCart(global.user.userId, {
			prodId: prodId,
			price: product.price,
			qty: qty,
		});
		return res.status(201).json({ success: true, cart: result });
	}

	let { guestId } = req.body;

	if (!guestId) {
		guestId = `guest-${uuid().substring(0, 5)}`;
	} else {
		const cartId = guestId.replace('guest-', 'cart-');
		const cart = await getCartByCartId(cartId);
		console.log(cart);
		if (!cart) {
			return next({
				status: 404,
				message: `No cart found for guest ${guestId}`,
			});
		}
	}
	const result = await updateCart(guestId, {
		prodId: prodId,
		price: product.price,
		qty: qty,
	});
	return res
		.status(201)
		.json({ success: true, guestId: guestId, cart: result });
});

// Get campaign
router.get('/:userId/campaign', validateUserId, async (req, res, next) => {
	const userId = req.params.userId;

	const result = await campaignCartFree(userId);
	if (result) {
		return res.status(200).json({
			success: true,
			message: `Campaign applied for user ${userId}`,
			cart: result,
		});
	} else {
		return next({
			status: 404,
			message: `No cart found for user ${userId}`,
		});
	}
});

// ==== FALLBACK ====
router.use(fallbackService);

export default router;
