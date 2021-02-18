'use strict'
const Token = use("App/Models/Token");
const User = use("App/Models/User");
const Encryption = use('Encryption')

class LoginWithTokenController {
  async login({request, response, auth}){
    // retrieve the token parameter from the query string
    let rawToken = request.get()['token'];
    let plainToken = Encryption.decrypt(rawToken);

    // we use the plain token to find the matching Token in the database
    let token = await Token.findBy('token', plainToken);
    if (token) {
      // find the user to log in
      let user = await User.find(token.user_id);
      // login the user via session (for the checkout process to work)
      await auth.login(user);
      // replace the res.send with the proper redirects
      response.send("User has been logged in successfully")
    } else {
      response.send("Invalid token");
    }
  }
}

module.exports = LoginWithTokenController
