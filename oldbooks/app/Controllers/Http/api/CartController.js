'use strict'

class CartController {
  async updateCart({request, response, auth}) {
    try {
      let user = await auth.authenticator('api');
      user.cart_content = request.post().cart_content;
      user.save();
    } catch (error) {
      console.log(error);
      response.send(error)
    }
  }
}

module.exports = CartController
