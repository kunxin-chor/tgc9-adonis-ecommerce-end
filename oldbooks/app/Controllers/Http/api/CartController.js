'use strict'

class CartController {
  async getCart({ request, response, auth }) {
    try {
      let user = await auth.authenticator('api').getUser();
      response.json(JSON.parse(user.cart_content));
    } catch (error) {
      console.log(error);
      response.send(error)
    }
  }

  async updateCart({ request, response, auth }) {
    try {
      let user = await auth.authenticator('api').getUser();
      user.cart_content = JSON.stringify(request.post().cart_content);
      await user.save();
      response.json(user.cart_content)
    } catch (error) {
      response.send(error)
    }
  }
}

module.exports = CartController
