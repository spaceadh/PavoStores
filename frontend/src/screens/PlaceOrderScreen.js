import axios from 'axios';
import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import  getError  from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import Footer from '../components/Footer';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';


const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false
  });
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const minShippingPercentage = 0.15;
  const maxShippingPercentage = 0.20;
  const randomShippingPercentage =
    Math.random() * (maxShippingPercentage - minShippingPercentage) +
    minShippingPercentage;

  cart.shippingPrice = round2(randomShippingPercentage * cart.itemsPrice);
  cart.taxPrice = round2(0.16 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const totalPrice = cart.totalPrice.toFixed(2);
  const amountInt = parseInt(totalPrice); // Convert amount to integer

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMpesa, setpaymentMpesa] = useState(false);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(amountInt);
  const [message, setMessage] = useState('');
  const [isloading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]); 

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      if (cart.paymentMethod === 'M-Pesa') {
          setpaymentMpesa(true)
      }else if (cart.paymentMethod === 'COD'){
        
      }else{
        setPaymentSuccess(false);
      }
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amountString = amount.toString(); // Convert integer back to string
      console.log(amountString);

      const auth = process.env.REACT_APP_SECRETKEY;
      const username = process.env.REACT_APP_USERNAME;

      const response = await axios.post('https://rotsiapi-f2e9f999f0e0.herokuapp.com/payments/stkPush/v1', {
        phone,
        amount: amountString,
        username
      }, {
        headers: {
          Authorization: auth
        }
      });
    
      setMessage('Payment successful!');
      setPaymentSuccess(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          isPaid:true,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/orderhistory`);
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL' });
      console.error(error);
      setMessage('Payment failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address:</strong> {cart.shippingAddress.address},
                {cart.shippingAddress.town}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.county}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
  
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
  
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>Ksh {item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        {paymentMpesa ? (
            paymentSuccess ? (
              <Card raised>
                <CardContent>
                  <h2>Payment Successful!</h2>
                  <p>Total Amount Paid: Ksh {cart.totalPrice.toFixed(2)}</p>
                </CardContent>
              </Card>
            ) : (
              <Col md={4}>
                <Card raised>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <TextField
                        label="Phone Number"
                        variant="outlined"
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <TextField
                        label="Amount"
                        variant="outlined"
                        margin="normal"
                        value={amount}
                        InputProps={{
                          readOnly: true
                        }}
                        required
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isloading}
                        endIcon={isloading && <CircularProgress size={20} />}
                      >
                        {isloading ? 'Processing...' : 'Pay'}
                      </Button>
                    </form>
                    {message && <p>{message}</p>}
                  </CardContent>
                </Card>
              </Col>
            )
          ) : (
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>Ksh {cart.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>Ksh {cart.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>Ksh {cart.taxPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Order Total</strong>
                        </Col>
                        <Col>
                          <strong>Ksh {cart.totalPrice.toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeOrderHandler}
                          // disabled={cart.cartItems.length === 0}
                        >
                          Place Order
                        </Button>
                      </div>
                      {loading && <LoadingBox />}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          )}
      </Row>
      <Footer />
    </div>
  );
}

export default PlaceOrderScreen;