import React, { useState } from 'react'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/solid'
import Currency from 'react-currency-formatter'
import { useDispatch } from 'react-redux'
import { addToBasket } from '../slices/basketSlice'

function Product({ product }) {
  const [rating] = useState(Math.floor(Math.random() * (5 - 1 + 1)) + 1)

  const [hasPrime] = useState(Math.random() < 0.5)

  const dispatch = useDispatch()

  const addItemToBasket = () => {
    const item = { ...product, rating, hasPrime }
    dispatch(addToBasket(item))
  }

  return (
    <div className='relative flex flex-col m-5 bg-white z-30 p-10'>
      <p className='absolute top-2 right-2 text-xs text-gray-400 italic'>
        {product.category}
      </p>
      <Image src={product.image} height={200} width={200} objectFit='contain' />
      <h4 className='my-3 h-[70px] mb-10 line-clamp-3 overflow-hidden'>
        {product.title}
      </h4>
      <div className='flex'>
        {Array(rating)
          .fill()
          .map((_, i) => (
            <StarIcon className='h-5 text-yellow-500' key={i} />
          ))}
      </div>
      <p className='text-xs my-2 h-12 line-clamp-3'>{product.description}</p>

      <div className='mb-1'>
        <Currency quantity={product.price} currency='USD' />
      </div>

      {hasPrime && (
        <div className='absolute flex items-center space-x-2 bottom-20'>
          <img
            loading='lazy'
            className='object-contain w-12'
            src='https://links.papareact.com/fdw'
            alt=''
          />
          <p className='text-xs text-gray-500'>FREE Next-day Delivery</p>
        </div>
      )}

      <button className='mt-12 button' onClick={addItemToBasket}>
        Add to Basket
      </button>
    </div>
  )
}

export default Product
