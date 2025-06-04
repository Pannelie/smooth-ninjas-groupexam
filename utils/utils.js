import { v4 as uuid } from "uuid";

export function generateUserId() {
  const id = uuid();
  const shortId = id.replace(/-/g, "").substring(0, 5);
  return `user-${shortId}`;
}

export function generateOrderId() {
  const id = uuid();
  const shortId = id.replace(/-/g, "").substring(0, 5);
  return `order-${shortId}`;
}

export function generateCartId(userId) {
  const id = userId.slice(-5);
  return `cart-${id}`;
}
