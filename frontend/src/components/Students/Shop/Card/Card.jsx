import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../../../Context/Context";

function Card({ image, title, price, id }) {
  const [inCart, setInCart] = useState(false);
  const { cart, addToCart, itemsCount, updateItemCount } = useContext(Context);

  useEffect(() => {
    setInCart(cart.some((item) => item.id === id));
  }, [cart, id]);

  const handleButton = () => {
    addToCart({ id, image, title, price });
  };

  const handleDecrease = () => {
    updateItemCount(id, itemsCount[id] - 1);
  };

  const handleIncrease = () => {
    updateItemCount(id, itemsCount[id] + 1);
  };

  return (
    <div className="w-60 rounded-lg overflow-hidden shadow-lg bg-white mb-16 flex flex-col">
      <img className="w-full h-56 object-cover" src={image} alt={title} />
      <div className="px-6 py-4 text-center flex-1">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">₹{price}</p>
      </div>
      <div className="px-6 pb-4 text-center">
        {!inCart ? (
          <button
            id={`button-${id}`}
            onClick={handleButton}
            className="button bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex justify-center flex-row gap-4">
            <button
              id={`decrease-${id}`}
              onClick={handleDecrease}
              className="button bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              -
            </button>
            <div id={`number-${id}`} className="flex items-center">
              {itemsCount[id] || 0}
            </div>
            <button
              id={`increase-${id}`}
              onClick={handleIncrease}
              className="button bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
