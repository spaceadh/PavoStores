import React , { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import axios from 'axios';
import { Store } from '../Store';


function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = (item) => {
    if (!Array.isArray(cartItems)) {
      console.error('cartItems is not an array');
      return;
    }

    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      // Item already exists in the cart, perform update logic
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      ctxDispatch({ type: 'CART_ADD_ITEM', payload: updatedCartItems });
    } else {
      // Item is not in the cart, add it
      ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity: 1 } });
    }
  };

  return (
    <Card key={product.slug}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>Ksh{product.price}</Card.Text>
        <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;


