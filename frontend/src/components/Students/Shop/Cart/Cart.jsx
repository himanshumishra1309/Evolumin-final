import React, { useContext } from 'react';
import { Context } from '../../../../Context/Context';

function Cart({ searchTerm }) {
  const { cart, itemsCount, updateItemCount, removeFromCart } = useContext(Context);

  const filteredCart = cart.filter(item => 
    searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (itemsCount[item.id] || 0), 0);
  };

  //  itemsCount[item.id]: Retrieves the quantity of the current item (item.id) from the itemsCount object.
  //  || 0: If itemsCount[item.id] is undefined or null, it defaults to 0. This ensures that items not present in itemsCount are treated as having a quantity of 0

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Remove non-numeric characters and parse the price
      return total + (price * (itemsCount[item.id] || 0));
    }, 0);
  };

  return (
    <div className='relative'>
      {cart.length === 0 ? (
        <p className="flex items-center justify-center text-8xl pt-32" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
          Your cart is empty
        </p>
      ) : (
        filteredCart.length === 0 ? (
          <p className="text-center text-6xl mt-10">No such item found in the cart</p>
        ) : (
          <div className='flex flex-col'>
            <div className='w-full flex items-center justify-between sticky top-0 border rounded-2xl bg-white shadow-lg p-2'>
              <div className='text-2xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>TOTAL ITEMS: {getTotalItems()}</div>
              <div className='text-2xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>TOTAL PRICE: {getTotalPrice().toFixed(2)}</div>
              <button className='p-3 m-0 hover:bg-teal-600 hover:text-white'>BUY NOW</button>
            </div>
            <div className="grid grid-cols-5 gap-5 m-5 pl-5">
              {filteredCart.map((item) => (
                  <div key={item.id} className="w-60 rounded-lg overflow-hidden shadow-lg bg-white flex flex-col mb-5">
                    <img className="w-full h-44 object-cover" src={item.image} alt={item.title} />
                    <div className="px-6 py-4 text-center flex-1">
                      <div className="font-bold text-xl mb-2">{item.title}</div>
                      <p className="text-gray-700 text-base">{item.price}</p>
                    </div>
                    <div className="px-6 pb-4 text-center flex flex-col">
                      <div className="flex justify-center flex-row gap-4">
                        <button
                          id={`decrease-${item.id}`}
                          onClick={() => updateItemCount(item.id, itemsCount[item.id] - 1)}
                          className="button bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                          >
                          -
                        </button>
                        <div id={`number-${item.id}`} className="flex items-center">
                          {itemsCount[item.id] || 0}
                        </div>
                        <button
                          id={`increase-${item.id}`}
                          onClick={() => updateItemCount(item.id, itemsCount[item.id] + 1)}
                          className="button bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                          >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                        >
                        Remove
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Cart;
