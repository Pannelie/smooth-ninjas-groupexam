export function validateAuthData(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return next({
      status: 400,
      message: `Username and password are required`,
    });
  }
  next();
}

export function validateCartId(req, res, next) {
  const { cartId } = req.body;
  if (!cartId) {
    return next({
      status: 400,
      message: `Cart ID is required`,
    });
  }
  
  next();
}