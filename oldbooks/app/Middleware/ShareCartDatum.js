'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ShareCartDatum {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, view, session }, next) {
    // call next to advance the request
    let cart = session.get('cart', {});
    view.share({
      'secret_of_life': 42,
      'cart':cart,
      'cart_size':Object.keys(cart).length
    })
    await next()
  }
}

module.exports = ShareCartDatum
