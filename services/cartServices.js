import Cart from "../models/cart.js";
import { generateCartId } from "../utils/utils.js";

async function getOrCreateCart(userId) {
  try {
    const cartId = generateCartId(userId);
    let cart = await Cart.findOne({ cartId });
    if (!cart) {
      cart = await Cart.create({
        cartId,
        items: [],
      });
    }
    return cart;
  } catch (error) {
    console.log(`Could not get or create cart: ${error.message}`);
    return null;
  }
}

export async function getAllCarts() {
  try {
    const carts = await Cart.find();
    const cartDetails = carts.map((cart) => {
      const totalPrice = cart.items.reduce((sum, item) => {
        return sum + item.price * item.qty;
      }, 0);
      return {
        cartId: cart.cartId,
        items: cart.items,
        totalPrice,
      };
    });

    return cartDetails;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getCartByCartId(cartId) {
  try {
    const cart = await Cart.findOne({ cartId });
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function updateCart(userId, product) {
  try {
    const cart = await getOrCreateCart(userId);
    if (!cart) {
      throw new Error("Could not retrieve a cart");
    }
    console.log(product);

    const item = cart.items.find((i) => i.prodId === product.prodId);

    if (item) {
      item.qty = product.qty;
    } else {
      cart.items.push(product);
    }

    if (product.qty === 0) {
      console.log("Removes item from cart!");
      cart.items = cart.items.filter((i) => i.prodId !== product.prodId);
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function emptyCartById(cartId) {
  try {
    const result = await Cart.findOneAndUpdate({ cartId: cartId }, { $set: { items: [] } });
    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function campaignCartFree(userId) {
  try {
    const cart = await getOrCreateCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return { total: 0, discount: 0, finalTotal: 0 };
    }

    const allItems = [];
    cart.items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        allItems.push({ prodId: item.prodId, price: item.price });
      }
    });

    allItems.sort((a, b) => a.price - b.price);

    const total = allItems.reduce((sum, item) => sum + item.price, 0);

    const freeCount = Math.floor(allItems.length / 3);

    const freeProducts = allItems.slice(0, freeCount);
    const discount = freeProducts.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = total - discount;

    return {
      items: cart.items,
      total,
      discount,
      finalTotal,
      freeCount,
      freeProducts,
    };
  } catch (error) {
    console.log(error.message);
    return null;
  }
}