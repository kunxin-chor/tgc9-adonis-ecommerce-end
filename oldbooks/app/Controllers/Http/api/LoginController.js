'use strict'

const User = use('App/Models/User')

class LoginController {
  async login({ request, response, auth }) {
    let data = request.post();
    let uid = data.email;
    let password = data.password;
    let token = await auth.authenticator('api').attempt(uid, password)
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
      response.json(newUser.toJSON())
    } catch (e) {
      console.log(e);
    }
  }
  async profile({ response, auth }) {
    console.log("hi");
    try {
      let user = await auth.authenticator('api').getUser()
      response.json(user);
    } catch (error) {
      console.log(error);
      response.send(error)
    }

  }

  async protected({response, auth}) {
    response.json("Protected route access")
  }

}

module.exports = LoginController
