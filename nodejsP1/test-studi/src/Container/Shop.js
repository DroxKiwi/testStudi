import { connect } from 'react-redux'
import Shop from '../Shop'

const mapStateToProps = state => {
  return {
    products: state.products,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddItemToCart: item => {
      dispatch({ type: 'BUY_ITEM', payload: item })
    },
    onEmptyCart: () => {
      dispatch({ type: 'EMPTY_CART' })
    }
  }
}

const ShopContainer = connect(mapStateToProps, mapDispatchToProps)(Shop)

export default ShopContainer