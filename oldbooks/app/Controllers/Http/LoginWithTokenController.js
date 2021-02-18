'use strict'
const Token = use('App/Models/Token')
const User = use('App/Models/User')
const Encryption = use('Encryption')

class LoginWithTokenController {
  async login({request, response, auth}) {
    let tokenData = request.get()['token'];
    tokenData = Encryption.decrypt(tokenData);

    let token = await Token.findBy('token', tokenData);
    if (token) {
      let user = await User.find(token.user_id);
      await auth.login(user);
      response.send("user has been logged in successfully")
    } else {
      // change this to a redirect instead for an actual project
    response.send("Error. Invalid token")
    }

  }
}

module.exports = LoginWithTokenController
