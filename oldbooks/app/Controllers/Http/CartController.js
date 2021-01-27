'use strict'

const CART_KEY = 'cart'
const Book = use('App/Models/Book')
const User = use('App/Models/User')

class CartController {
  async addToCart({ params, session, response, auth }) {
    // imagine a user session to be a dictionary
    // The first arugment in session.get is the key. The second argument
    // is what to return if the key is not found in user session i.e default
    let cart = session.get(CART_KEY,null);

    // if the shopping cart is not found in session, we use the database version
    if (!cart) {
      // make sure there is cart saved in the user's row
      if (auth.user.cart_content) {
        cart = JSON.parse(auth.user.cart_content);
      } else {
        cart = {};
      }
    }
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
    session.put(CART_KEY, cart);
    auth.user.cart_content = JSON.stringify(cart);
    auth.user.save();

    // auth.user will contain the model of the currently logged in user
    response.route('show_all_books')

  }

  show({ view, session }) {
    let cart = session.get(CART_KEY, {});
    console.log(cart)
    return view.render('cart/show', {
      "cart": cart
    })
  }

  clear({ session, response }) {
    session.clear(CART_KEY);
    response.route('show_all_books')

  }

  remove({session, response, params}) {
    let cart = session.get(CART_KEY, {});
    if (cart.hasOwnProperty(params.book_id)) {
      delete cart[params.book_id]
    }
    response.route('show_cart');
  }

  updateQuantity({session, request, response, params}) {
    let cart = session.get(CART_KEY, {});
    if (cart.hasOwnProperty(params.book_id)){
      let newQuantity = request.post().newQty;
      cart[params.book_id].qty = newQuantity;
      session.put(CART_KEY, cart);
    }
    response.route('show_cart')
  }

}

module.exports = CartController
