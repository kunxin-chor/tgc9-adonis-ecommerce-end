'use strict'

class CartController {
  async getCart({request, response, auth}) {
    // get the current logged in user

    let user = await auth.authenticator('api').getUser();
    // reminder that cart_content is a JSON string
    // use JSON.parse to convert it to a JSON object
    let cartContent = JSON.parse(user.cart_content);
    response.json(cartContent);
  }

  // for the React client to update the shopping cart
  // Will send a JSON object representing the shopping cart to this route
  async updateCart({request, response, auth}) {
    let user = await auth.authenticator('api').getUser();
    // we use serialization (i.e convert an object to a string)
    // and then save the string into the database
    user.cart_content = JSON.stringify(request.post().cart_content);
    await user.save();
    response.json(user.cart_content);
  }
}

module.exports = CartController
