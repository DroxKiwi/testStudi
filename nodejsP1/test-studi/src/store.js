import { configureStore, createSlice } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, shopSlice.reducer)

const store = configureStore({
  reducer: persistedReducer
})

export const persistor = persistStore(store)
export const { buyItem, emptyCart } = shopSlice.actions
export default store