'use strict'

const User = use('App/Models/User')

class LoginController {
  async login({ request, response, auth }) {
    let data = request.post();
    let uid = data.email;
    let password = data.password;
    // generate the personal token for this user
    let token = await auth.authenticator('api').attempt(uid, password);
    return response.json(token);
  }

  async register({ request, auth, response }) {
    try {
      let data = request.post();
      let newUser = new User();
      newUser.username = data.username;
      newUser.password = data.password;
      newUser.email = data.email;
      await newUser.save();
      return response.json(newUser);
    } catch (e) {
      return response.json({
        'error': e.message
      })
    }

  }

  async profile({auth, response}) {
    let user = await auth.authenticator('api').getUser();
    response.json(user)
  }

  protected({response, auth}) {
    response.json("You are accessing protected route")
  }
}

module.exports = LoginController
