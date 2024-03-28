import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
  order: {
    loadingDeliver: false,
    successDeliver: false,
    errorDeliver: '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };
    // reducer.js


 
    case 'CART_ADD_ITEM':
      const itemToAdd = action.payload;
      const existingItem = state.cart.cartItems.find(item => item._id === itemToAdd._id);

      if (existingItem) {
        // If the item already exists in cart, update its quantity
        const updatedCartItems = state.cart.cartItems.map(item =>
          item._id === existingItem._id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return {
          ...state,
          cart: { ...state.cart, cartItems: updatedCartItems },
        };
      } else {
        // If the item is new in cart, add it with quantity 1
        return {
          ...state,
          cart: { ...state.cart, cartItems: [...state.cart.cartItems, { ...itemToAdd, quantity: 1 }] },
        };
      }
   


      
        case 'CART_REMOVE_ITEM':
          return {
            ...state,
            cart: {
              ...state.cart,
              cartItems: state.cart.cartItems.filter(item => item.id !== action.payload.id), // Ensure cartItems remains an array
            },
          };
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
      
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case 'ORDER_DELIVER_REQUEST':
      return { ...state, order: { ...state.order, loadingDeliver: true } };
    case 'ORDER_DELIVER_SUCCESS':
      return {
        ...state,
        order: {
          ...state.order,
          loadingDeliver: false,
          successDeliver: true,
          errorDeliver: '',
        },
      };
    case 'ORDER_DELIVER_FAIL':
      return {
        ...state,
        order: {
          ...state.order,
          loadingDeliver: false,
          successDeliver: false,
          errorDeliver: action.payload,
        },
      };
   
        

  
    default:
      return state;
  }
}


export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
