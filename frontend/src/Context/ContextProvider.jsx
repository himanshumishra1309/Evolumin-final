import React, { useState, useEffect } from "react";
import { Context } from "./Context";

const ContextProvider = ({ children }) => {
  const [visibleProfile, setVisibleProfile] = useState(false);
  const [suggestedPills, setSuggestedPills] = useState('');
  const [prescribe, setPrescribe] = useState(false);
  const [shifts, setShifts] = useState(false);
  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return storedCart ? storedCart : [];
  });

  const [itemsCount, setItemsCount] = useState(() => {
    const storedItemsCount = JSON.parse(localStorage.getItem("itemsCount"));
    return storedItemsCount ? storedItemsCount : {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("itemsCount", JSON.stringify(itemsCount));
  }, [cart, itemsCount]);

  const addToCart = (item) => {
    const isItemInCart = cart.some(cartItem => cartItem.id === item.id);
    if (!isItemInCart) {
      setCart(prevCart => [...prevCart, item]);
      setItemsCount(prevCount => ({ ...prevCount, [item.id]: 1 }));
    }
  };

  const updateItemCount = (id, count) => {
    if (count < 1) {
      removeFromCart(id);
    } else {
      setItemsCount(prevCount => ({ ...prevCount, [id]: count }));
    }
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    setItemsCount(prevCount => {
      const newCount = { ...prevCount };
      delete newCount[id];
      return newCount;
    });
  };

  return (
    <Context.Provider value={{ cart, addToCart, itemsCount, updateItemCount, removeFromCart,visibleProfile, setVisibleProfile, prescribe, setPrescribe, shifts, setShifts, suggestedPills, setSuggestedPills }}>
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
