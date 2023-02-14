import React, { Component } from 'react';
import '../../Templates/CSS/Shop.css';

export default class Shop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [
        {
          id: Math.random(),
          label: "Un livre (pages fournies)",
          price: 10,
        },
        {
          id: Math.random(),
          label: "Un Plumbus",
          price: 499,
        },
        {
          id: Math.random(),
          label: "Un ordinateur Machintosh",
          price: 1200,
        }
      ],
      cart: [],
    };

    /**
     * Add item to cart if not already there
     * @param {Object} item 
     */
    this.buyItem = (item) => {
      if (!this.state.cart.find((cartItem) => cartItem.id === item.id)) {
        this.setState({
          ...this.state,
          cart: [...this.state.cart, item]
        });
      }
    };

    /**
     * Remove item from cart
     * @param {Object} item 
     */
    this.removeItem = (item) => {
      this.setState({
        ...this.state,
        cart: this.state.cart.filter((cartItem) => cartItem.id !== item.id)
      });
    };
  };

  render() {
    return (
      <div className="Shop">
        <h2>Produits disponibles</h2>
        <ul className="Products">
          {
            this.state.products.map((product) => {
              return (
                <li key={product.id}>
                  <span>{product.label} - {product.price}€</span>
                  <button 
                    type="button"
                    className="AddToCart"
                    disabled={this.state.cart.find((cartItem) => cartItem.id === product.id)}
                    onClick={() => this.buyItem(product)}
                  >
                    + Ajouter au panier
                  </button>
                </li>
              )
            })
          }
        </ul>

        <h2>Mon panier</h2>
        <ul className="CartItems">
          {
            this.state.cart.map((cartItem) => {
              return (
                <li key={cartItem.id}>
                  <span>{cartItem.label} - {cartItem.price}€</span>
                  <button 
                    type="button"
                    className="RemoveFromCart"
                    onClick={() => this.removeItem(cartItem)}
                  >
                    Supprimer du panier
                  </button>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  };
};
