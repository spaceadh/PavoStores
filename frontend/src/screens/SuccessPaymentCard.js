import React, { useState, useEffect, useReducer, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const SuccessPaymentCard = ({ totalPrice }) => (
    <Card raised>
      <CardContent>
        <h2>Payment Successful!</h2>
        <p>Total Amount Paid: Ksh {totalPrice.toFixed(2)}</p>
      </CardContent>
    </Card>
);


export default SuccessPaymentCard;