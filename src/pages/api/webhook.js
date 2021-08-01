import { buffer } from 'micro'
import * as admin from 'firebase-admin'

var serviceAccount = require('../../../permissions.json')

// Secure connection to Firebase from BackEnd
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app()

// Connection to Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const endpointSecret = process.env.STRIPE_SIGNING_SECRET

const fullfillOrder = async (session) => {
  return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCESS Order ${session.id} has been added to the DB`)
    })
}

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let stripeEvent

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        endpointSecret
      )
      console.log('stripeEvent', stripeEvent)
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    if ('checkout.session.completed' === stripeEvent.type) {
      const session = stripeEvent.data.object
      console.log('payment success', session)
      // Do something here on payment success, like update order etc.

      // Fulfill the order...
      return fullfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error ${err.message}`))
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handler

export const config = {
  api: {
    bodyParser: false,
  },
}
