import React, { useState, useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const MPesaPaymentForm = ({ totalPrice, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(totalPrice.toFixed(2));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/mpesa/stk-push-request', {
        phoneNumber: phone,
        amount
      });
      const data = response.data;
      console.log(data);
      // Check if payment is successful (you need to define this logic based on the API response)
      if (data.success === true) {
        setMessage('Payment successful!');
        onSuccess(); // Call onSuccess function provided by the parent component
      } else {
        setMessage('Payment failed!');
      }
    } catch (error) {
      console.error(error);
      setMessage('Payment failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Processing...' : 'Pay'}
          </Button>
        </form>
        {message && <p>{message}</p>}
      </CardContent>
    </Card>
  );
};

export default MPesaPaymentForm;