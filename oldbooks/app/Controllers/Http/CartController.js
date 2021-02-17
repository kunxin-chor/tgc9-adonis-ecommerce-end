'use strict'

const CART_KEY = 'cart'
const Book = use('App/Models/Book')

const getCartFromUser = async (session, auth) => {

  let cart = session.get(CART_KEY, {});
  let user = null;
  try {
    user = await auth.getUser();
  } catch {
    user = null;
  }

  // if cart is null, get from user instead
  try {
    if (Object.keys(cart).length == 0 && user && user.cart_content) {
      cart = JSON.parse(user.cart_content);
    }
  }
  catch {
    cart = {};
  }
  return cart;
}

const saveCartToUser = async (session, cart, auth) => {
  console.log("saving cart");
  console.log(cart);
  let user = null;
  try {
    user = await auth.getUser();
  } catch {
    user = null;
  }

  session.put(CART_KEY, cart);
  if (user) {
    user.cart_content = JSON.stringify(cart);
    await user.save();
  }
}

class CartController {

  async addToCart({ params, session, response, auth }) {
    // imagine a user session to be a dictionary
    // The first arugment in session.get is the key. The second argument
    // is what to return if the key is not found in user session i.e default
    let cart = await getCartFromUser(session, auth)

    // retrieve the book that the user wants to add cart
    let book = await Book.find(params.book_id);

    if (cart.hasOwnProperty(book.id)) {
      // if the book already exists in the cart, increase
      // the qty by 1
      cart[book.id].qty += 1;
    } else {
      // if the book does not exists, add its detail to the cart
      cart[book.id] = {
        ...book.toJSON(),
        qty: 1
      }
    }


    // put the cart object into the session under the key specified in the first argument
    saveCartToUser(session, cart, auth);
    response.route('show_all_books')

  }

  async show({ view, session, auth }) {
    let cart = await getCartFromUser(session, auth)
    console.log(cart)
    return view.render('cart/show', {
      "cart": cart
    })
  }

  async clear({ session, response, auth }) {
    session.clear(CART_KEY);
    try {
      let user = await auth.getUser();
      user.cart_content = "";
      await user.save();
    } catch {

    }

    response.route('show_all_books')

  }

  async remove({ session, response, params, auth }) {
    let cart = await getCartFromUser(session, auth)
    if (cart.hasOwnProperty(params.book_id)) {
      delete cart[params.book_id]
    }
    saveCartToUser(session, cart, auth)
    response.route('show_cart');
  }

  async updateQuantity({ session, request, response, params, auth }) {
    let cart = await getCartFromUser(session, auth)
    if (cart.hasOwnProperty(params.book_id)) {
      let newQuantity = request.post().newQty;
      cart[params.book_id].qty = newQuantity;
      session.put(CART_KEY, cart);
      saveCartToUser(session, cart, auth);
    }
    response.route('show_cart')
  }

}

module.exports = CartController
