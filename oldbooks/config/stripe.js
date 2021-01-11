'use strict'

const Env = use('Env')

module.exports= {
  publishable_key: Env.get('STRIPE_KEY_PUBLISHABLE', ''),
  secret_key: Env.get('STRIPE_KEY_SECRET', ''),
  success_url: Env.get('APP_URL') + '/checkout/success',
  error_url: Env.get('APP_URL') + '/checkout/error',
  endpoint_secret: Env.get('STRIPE_ENDPOINT_SECRET', '')
}
