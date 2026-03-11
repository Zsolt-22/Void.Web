'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedAddress = localStorage.getItem('shippingAddress');
    if (storedAddress) {
      setShippingAddress(JSON.parse(storedAddress));
    }
    const storedPayment = localStorage.getItem('paymentMethod');
    if (storedPayment) {
      setPaymentMethod(JSON.parse(storedPayment));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  const addToCart = (product, qty) => {
    const item = { ...product, qty };
    const existItem = cartItems.find((x) => x._id === item._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) => (x._id === existItem._id ? item : x))
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const calculatePrices = () => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = 0.15 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: Number(shippingPrice.toFixed(2)),
      taxPrice: Number(taxPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
        calculatePrices,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
