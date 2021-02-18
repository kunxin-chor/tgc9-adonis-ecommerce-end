'use strict'

const Config = use('Config')
// setup stripe library
const Stripe = use('stripe')(Config.get('stripe.secret_key'))
const CART_KEY = 'cart'

const getCartFromUser = async (session, auth) => {

  let cart = session.get(CART_KEY, {});
  let user = null;
  try {
    user = await auth.getUser();
  } catch {
    user = null;
  }

  // if cart is null, get from user instead
  try {
    if (Object.keys(cart).length == 0 && user && user.cart_content) {
      cart = JSON.parse(user.cart_content);
    }
  }
  catch {
    cart = {};
  }
  return cart;
}


class CheckoutController {
  async checkout({response, session, view, auth}) {
     // 1. create line items (i.e what the user is paying for)
     let cart = await getCartFromUser(session, auth);

     // ...convert the cart from object to an array
     let cartArray = Object.values(cart);

     let lineItems = cartArray.map( cartItem => {
       // NOTE: the keys in this object are required by stripe. So we have to follow
       return {
         'name': cartItem.title,
         'images': [cartItem.image_url],
         'amount' : cartItem.price,
         'quantity': cartItem.qty,
         'currency':'SGD',
       }
     })

     // ...create meta-data
     let metaData = JSON.stringify(cartArray);

     // 2. create the payment
     // note: all the keys below are specified by stripe
     const payment = {
       payment_method_types:['card'],
       line_items: lineItems,
       success_url: Config.get('stripe.success_url'),
       cancel_url: Config.get('stripe.error_url'),
       metadata: {
         'orders': metaData
       }
     }

     // 3. send that payment session to stripe (to get the session id)
     let stripeSession = await Stripe.checkout.sessions.create(payment);

     // 4. send the session id to our view (the view will do the redirect)
     return view.render('checkout/checkout', {
       sessionId: stripeSession.id,
       publishableKey: Config.get('stripe.publishable_key')
     })
  }

  processPayment({request, response}) {
    let payload = request.raw();
    let sigHeader = request.header('stripe-signature');
    let event = null;
    let endpointSecret = Config.get('stripe.endpoint_secret')

    // verify with Stripe that it is they who actually send
    // the data
    try {
      event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret)
    } catch (e) {
      console.log(e);
      // send the error to stripe
      response.json({
        'error':e.message
      })
    }

    if (event.type=='checkout.session.completed') {
      let stripeSession = event.data.object;
      console.log("WEBHOOK CALLBACK")
      console.log(stripeSession);
      console.log(stripeSession.metadata);
    }

    response.json({
      received:true
    })
  }
}


module.exports = CheckoutController
