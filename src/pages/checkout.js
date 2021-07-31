import React from 'react'
import Header from '../components/Header'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { selectItems, selectTotal, selectQty } from '../slices/basketSlice'
import CheckoutProduct from '../components/CheckoutProduct'
import { useSession } from 'next-auth/client'
import Currency from 'react-currency-formatter'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
const stripePromise = loadStripe(process.env.stripe_public_key.toString())

function Checkout() {
  const items = useSelector(selectItems)
  const [session] = useSession()
  const total = useSelector(selectTotal)
  const qty = useSelector(selectQty)

  const createCheckoutSession = async () => {
    console.log('call')
    const stripe = await stripePromise

    const checkoutSession = await axios.post('/api/create-checkout-session', {
      items: items,
      email: session.user.email,
    })

    console.log('lol', checkoutSession.data.id)
    //Redirect user to Stripe Checkout
    const res = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    })

    if (res.error) {
      alert(res.error.message)
    }
  }

  return (
    <div className='bg-gray-100'>
      <Header />

      <main className='lg:flex max-w-screen-2xl mx-auto '>
        {/* Left */}
        <div className='flex-grow m-5 shadow-sm '>
          <div className='flex  justify-center mb-4'>
            <Image
              src='https://links.papareact.com/ikj'
              width={1020}
              height={250}
              objectFit='contain'
            />
          </div>

          <div className='flex flex-col p-5 space-y-10 bg-white'>
            <h1 className='text-3xl border-b pb-4'>Your Shopping Basket</h1>

            {items.map((item, index) => (
              <CheckoutProduct item={item} key={index} />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className='flex flex-col bg-white p-10 shadow-md m-5'>
          <>
            <h2 className='whitespace-nowrap'>
              Subtotal ({qty} items):
              <span className='font-bold ml-2'>
                <Currency quantity={total} currency='USD' />
              </span>
            </h2>
            <button
              onClick={createCheckoutSession}
              role='link'
              disabled={!session || items.length === 0}
              className={`button mt-2 ${
                !session ||
                (items.length === 0 &&
                  'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed')
              } `}
            >
              {!session ? 'Sign in to checkout' : 'Proceed to checkout'}
            </button>
          </>
        </div>
      </main>
    </div>
  )
}

export default Checkout
