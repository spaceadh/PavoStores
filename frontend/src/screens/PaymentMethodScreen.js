import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

  

    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
      // Placeholder for M-Pesa integration
      if (paymentMethodName === 'M-Pesa') {
        // Your M-Pesa integration logic goes here
        // Redirect to M-Pesa payment page or initiate the payment process
         navigate('/placeorder');
         
        
        return;
      }

    if (paymentMethodName === 'COD') {
      
      navigate('/placeorder');
    } else {
      // Handle other payment methods if needed
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          
        
          <div className="mb-3">
            {/* Payment on Delivery radio button */}
            <Form.Check
              type="radio"
              id="COD"
              label="Payment on Delivery(CASH)"
              value="COD"
              checked={paymentMethodName === 'COD'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/* M-Pesa radio button */}
            <Form.Check
              type="radio"
              id="M-Pesa"
              label="M-Pesa"
              value="M-Pesa"
              checked={paymentMethodName === 'M-Pesa'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
