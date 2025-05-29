import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';

const router = express.Router();

// GET product to menu
router.get('/', async(req, res) => {
    try {
        const filePath = path.resolve('airbean.products.json');
        const data = await readFile(filePath, 'utf-8');
        const menu = JSON.parse(data);
        console.log('Menu loaded successfully');
        res.json(menu);
    } catch (error) {
        console.error('Error reading menu file:', error);
        res.status(500).json({ error: 'Failed to load menu' });
    }
});

export default router;