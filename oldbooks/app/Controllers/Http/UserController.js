'use strict'
const User = use('App/Models/User')
class UserController {
  register({view}){
    return view.render('users/register')
  }
  async processRegister({request, response}) {
    let formData = request.post();
    let user = new User();
    user.username = formData.username;
    user.email = formData.email;
    user.password = formData.password;
    await user.save();
    response.json(user);
  }
  login({view}){
    return view.render('users/login')
  }
  async processLogin({request, auth}) {
    let formData = request.post();
    await auth.attempt(formData.email, formData.password);
    return "Login success"
  }
  async show({auth, response}) {
    let user = await User.find(auth.user.id);
    return response.json(user);
  }
  async logout({auth, response, session}) {
    await auth.logout();
    session.clear();
    response.send("user has logged out!")
  }

}

module.exports = UserController
