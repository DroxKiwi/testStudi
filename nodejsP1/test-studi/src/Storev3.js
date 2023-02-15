import { configureStore, createSlice } from '@reduxjs/toolkit'

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    products: [
      {
        id: Math.random(),
        name: 'iPhone XR - 64gb',
        brand: 'Apple',
        price: 599
      },
      {
        id: Math.random(),
        name: 'Macbook Pro',
        brand: 'Apple',
        price: 2129
      },
      {
        id: Math.random(),
        name: 'Airpods Pro',
        brand: 'Apple',
        price: 279
      }
    ],
    cart: []
  },
  reducers: {
    buyItem(state, action){
      return {
        ...state,
        cart: [...state.cart, action.payload]
      }
    },
    emptyCart: state => ({
      ...state,
      cart: []
    })
  }
})

const store = configureStore({
  reducer: shopSlice.reducer
})

export const { buyItem, emptyCart } = shopSlice.actions
export default store