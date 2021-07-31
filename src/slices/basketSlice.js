import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    // Actions
    addToBasket: (state, action) => {
      const exist = state.items.find((x) => x.id === action.payload.id)
      if (exist) {
        const newBasket = state.items.map((x) =>
          x.id === action.payload.id ? { ...exist, qty: exist.qty + 1 } : x
        )
        state.items = newBasket
      } else {
        state.items = [...state.items, { ...action.payload, qty: 1 }]
      }
    },
    removeItemFromBasket: (state, action) => {
      const newBasket = state.items.filter((x) => x.id !== action.payload)
      state.items = newBasket
    },
    removeQtyFromBasket: (state, action) => {
      const exist = state.items.find((x) => x.id === action.payload)

      if (exist && exist.qty > 1) {
        const newBasket = state.items.map((x) =>
          x.id === action.payload ? { ...exist, qty: exist.qty - 1 } : x
        )
        state.items = newBasket
        console.log('hh', newBasket)
      } else {
        const newBasket = state.items.filter((x) => x.id !== action.payload)
        state.items = newBasket
      }

      //const index = state.items.findIndex(
      // (basketItem) => basketItem.id === action.payload
      //)

      //if (index >= 0) {
      //  newBasket.splice(index, 1)
      //} else {
      // console.warn(`can't remove ${action.payload.id}`)
      //}
      //state.items = newBasket
    },
  },
})

export const { addToBasket, removeQtyFromBasket, removeItemFromBasket } =
  basketSlice.actions

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items
export const selectQty = (state) =>
  state.basket.items.reduce((total, item) => total + item.qty, 0)
export const selectTotal = (state) =>
  state.basket.items.reduce((total, item) => total + item.price * item.qty, 0)

export default basketSlice.reducer
