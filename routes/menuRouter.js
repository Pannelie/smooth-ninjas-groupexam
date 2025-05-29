import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

// GET product to menu
router.get('/', async(req, res) => {
    try {
        const menu = await Product.find();
        console.log('Menu loaded successfully');
        res.json(menu);
    } catch (error) {
        console.error('Error reading menu file:', error);
        res.status(500).json({ error: 'Failed to load menu' });
    }
});

export default router;