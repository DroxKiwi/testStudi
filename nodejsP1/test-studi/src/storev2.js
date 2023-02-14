import { createStore } from 'redux'

const initialState = {
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
}

const shopReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'BUY_ITEM':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      }
    case 'EMPTY_CART':
      return {
        ...state,
        cart: []
      }
    default:
      return state
  }
}

const store = createStore(shopReducer)

export default store