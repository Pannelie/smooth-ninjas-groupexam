import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import menuRouter from './routes/menuRouter.js';
import authRouter from './routes/authRouter.js';
import cartRouter from './routes/cartRouter.js';
import ordersRouter from './routes/ordersRouter.js';

import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

// Middlewares
app.use(express.json());
app.use(logger());

// Routes
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// === GLOBAL FALLBACK ===
app.use((req, res, next) => {
	next({ status: 404, message: `Route '${req.originalUrl}' not found` });
});

//DB EmitEvents
database.on('error', (error) => console.log(error));
database.once('connected', () => {
	console.log('DB Connected');
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});

app.use(errorHandler);
