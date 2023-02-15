import React from 'react'
import styled from 'styled-components'

const Shop = ({ products, cart, onAddItemToCart, onEmptyCart }) => {
  return (
    <Wrapper>
      <h2>Produits</h2>
      <ul>
        {products.map((product) => (
          <Product key={product.id}>
            {product.name}
            <ButtonIcon
              type="button"
              onClick={() => onAddItemToCart(product)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </ButtonIcon>
          </Product>
        ))}
      </ul>

      <hr />

      <h2>Mon panier</h2>
      
      {cart.length === 0
        ? <Empty>Aucun article dans votre panier</Empty> 
        : (
          <ul>
            {cart.map((cartItem) => (
              <Product key={`${cartItem.id}-cart`}>{cartItem.name}</Product>
            ))}
          </ul>
        )
      }

      <Button
        type="button"
        onClick={onEmptyCart}
      >
        Empty my cart
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 48rem;
  min-height: 100vh;
  margin: 0 auto;
  background: #F5F5F5;
  padding: 2rem;
  color: gray;
`

const Product = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  margin: 0.75rem 0;
  padding: 1rem;
  border-radius: 10px;
`

const Button = styled.button`
  border-radius: 3px;
  border: none;
  border: 2px solid #5352ed;
  background: #5352ed;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding: 1rem 2rem;
  cursor: pointer;
`

const ButtonIcon = styled(Button)`
  background: none;
  padding: 5px;

  svg {
    width: 20px;
    color: #5352ed;
  }
`

const Empty = styled.span`
  display: block;
  margin: 2rem auto;
`

export default Shop