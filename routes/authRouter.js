import express from 'express';
import { createUser, getUser } from '../services/userServices.js';
import { generateUserId } from '../utils/utils.js';
import { validateAuthData } from '../middlewares/validators.js';
import { fallbackService } from '../services/fallbackService.js';

const router = express.Router();

//logout
router.get('/logout', (req, res, next) => {
	if (global.user) {
		const loggedOutUser = global.user.username;
		global.user = null;
		return res.status(200).json({
			success: true,
			message: `Successfully logged out ${loggedOutUser}`,
		});
	} else {
		return next({ status: 400, message: 'No user logged in' });
	}
});

// register user
router.post('/register', validateAuthData, async (req, res, next) => {
	const { username, password, role = 'user' } = req.body;

	const user = await createUser({
		username,
		password,
		userId: generateUserId(),
		role,
	});
	if (user) {
		return res
			.status(201)
			.json({ success: true, message: `User created successfully` });
	} else {
		return next({
			status: 400,
			message: `Registration was not successful`,
		});
	}
});

//login user
router.post('/login', validateAuthData, async (req, res, next) => {
	const { username, password } = req.body;

	const user = await getUser(username);
	if (user) {
		if (user.password === password) {
			global.user = user;
			return res.status(200).json({
				success: true,
				message: `Logged in ${user.username} successfully`,
				userId: user.userId,
				role: user.role,
			});
		} else {
			return next({ status: 400, message: `Wrong username or password` });
		}
	} else {
		return next({ status: 400, message: `No user found` });
	}
});

// ==== FALLBACK ====
router.use(fallbackService);

export default router;
