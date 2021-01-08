'use strict'

const Cloudinary = use('Cloudinary');
const Config = use('Config')
const apiSecret = Config.get('cloudinary.api_secret')

class CloudinaryController {
  sign({request}) {
    let data = request.get();
    // cloudinary/sign?params_to_sign=xxxx
    let toSign = JSON.parse(data.params_to_sign);
    return Cloudinary.utils.api_sign_request(toSign, apiSecret);
  }
}

module.exports = CloudinaryController
