import Cart from "../models/cart.js";

async function getOrCreateCart(userId) {
  try {
    let cart = await Cart.findOne({ cartId: userId });
    if (!cart) {
      cart = await Cart.create({
        cartId: userId,
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
    return carts;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getCartByCartId(cartId) {
  try {
    const cart = await Cart.find({ cartId: cartId });
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

    const item = cart.items.find((i) => i.prodId === product.prodId);
    if (item) {
      // Om det redan finns en av denna item i carten - updatera qty
      item.qty = product.qty;
    } else {
      // Det ny produkt i cart - lägg till den som skickas in
      cart.items.push(product);
    }

    if (product.qty === 0) {
      // Vi skickar in qyt = 0 i body och vill därför radera denna produkt från våran cart
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

export async function removeCartById(cartId) {
  try {
    const result = Cart.findOneAndDelete({ cartId: cartId });
    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}
