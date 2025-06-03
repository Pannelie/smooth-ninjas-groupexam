import express from 'express';
import Product from '../models/product.js';
import { fallbackService } from '../services/fallbackService.js';

const router = express.Router();

// GET product to menu
router.get('/', async (req, res, next) => {
	const menu = await Product.find();
	if (menu && menu.length > 0) {
		console.log('Menu loaded successfully');
		return res
			.status(200)
			.json({ success: true, message: `Found menu`, menu: menu });
	} else {
		return next({ status: 400, message: `No menu found` });
	}
});

// ==== FALLBACK ====
router.use(fallbackService);

export default router;
