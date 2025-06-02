export function validateAuthData(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return next({
      status: 400,
      message: `Username and password are required`,
    });
  }
  console.log(`validated username and password`);
  next();
}

export function validateUserId(req, res, next) {
  const { userId } = req.params;
  if (!userId) {
    return next({
      status: 400,
      message: "userId is required",
    });
  }
  console.log(`validated userId`);
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