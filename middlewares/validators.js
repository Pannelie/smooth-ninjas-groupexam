import { getProduct } from "../services/productServices.js";

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
  console.log(`validated cartId`);
  next();
}

export async function validateProductBody(req, res, next) {
  if (req.body) {
    const { prodId, qty } = req.body;
    if (!prodId || typeof qty !== "number") {
      return next({
        status: 400,
        message: "prodId and qty are required",
      });
    }
    const product = await getProduct(prodId);
    if (!product) {
      return next({ status: 404, message: "Product not found" });
    }

    next(); // Forsätt utan error
  } else {
    return next({
      status: 400,
      message: `Body required to add product`,
    });
  }
}
