// fallback in routes
export const fallbackService = (req, res, next) => {
	next({ status: 404, message: `Route '${req.originalUrl}' not found` });
};
