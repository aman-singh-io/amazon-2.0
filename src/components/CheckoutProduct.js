import React from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/solid'
import Currency from 'react-currency-formatter'
import { useDispatch } from 'react-redux'
import {
  removeQtyFromBasket,
  addToBasket,
  removeItemFromBasket,
} from '../slices/basketSlice'

function CheckoutProduct({ item }) {
  const dispatch = useDispatch()

  const addItemToBasket = () => {
    const product = { ...item }
    dispatch(addToBasket(product))
  }

  const removeQtyItemToBasket = (id) => {
    console.log(id)
    dispatch(removeQtyFromBasket(id))
  }

  const removeItemToBasket = (id) => {
    dispatch(removeItemFromBasket(id))
  }

  return (
    <div className='grid grid-cols-5'>
      <Image src={item.image} height={200} width={200} objectFit='contain' />
      <div className='col-span-3 mx-5'>
        <p>{item.title}</p>
        <div className='flex'>
          {Array(item.rating)
            .fill()
            .map((_, i) => (
              <StarIcon className='h-5 text-yellow-500' />
            ))}
        </div>
        <p className='text-xs mt-2 mb-2 line-clamp-3'>{item.description}</p>
        <Currency quantity={item.price} currency='USD' />
        {item.hasPrime && (
          <div className='flex items-center space-x-2 mt-5'>
            <img
              loading='lazy'
              className='object-contain w-12'
              src='https://links.papareact.com/fdw'
              alt=''
            />
            <p className='text-xs text-gray-500'>FREE Next-day Delivery</p>
          </div>
        )}
      </div>
      <div className='flex flex-col space-y-2 my-auto justify-self-end'>
        <div className='flex space-x-2 items-center'>
          <button
            className='button px-3'
            onClick={() => removeQtyItemToBasket(item.id)}
          >
            -
          </button>
          <h1>{`Quantity: ${item.qty}`}</h1>
          <button className='button px-3' onClick={addItemToBasket}>
            +
          </button>
        </div>

        <button className='button' onClick={() => removeItemToBasket(item.id)}>
          Remove from Basket
        </button>
      </div>
    </div>
  )
}

export default CheckoutProduct
