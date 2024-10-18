import React, { useEffect, useState } from 'react'
import Card from './Card/Card'
import { FaShoppingCart } from 'react-icons/fa'
import Data from './Data/Data.json'
import Cart from './Cart/Cart'
import description from '../../../svgs/drdes.svg'
import DoctorPrescription from './DoctorPrescription/DoctorPrescription'
import cart from '../../../svgs/cart.svg'

function Shop() {
  const [showCart, setShowCart] = useState(false)
  const [showPrescription, setShowPrescription] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");

  const handleCartToggle = () => {
    setShowCart((prevShowCart) => !prevShowCart);
    setShowPrescription(false);
    setSearchTerm("");
  }

  const handlePrescriptionToggle = () => {
    setShowPrescription((prevShowPrescription) => !prevShowPrescription);
    setShowCart(false)
    setSearchTerm("");
  }

  return (
    <div className='w-full' id="shop">
      <h1 className='m-6 text-4xl font-bold text-teal-600 mb-4 underline' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Shop Medicines
      </h1>
      <div className='border rounded-3xl shadow-lg m-10'>
          <div className='w-full flex justify-end mt-3 mb-5'>
            <button onClick={handlePrescriptionToggle} className='p-2 ml-3'><img src={description} className='w-40 h-12'/></button>
            {
              showCart ? 
              <input type='text' placeholder='Search Here...' className='border-teal-600 rounded-3xl ml-4 mr-4 p-4' onChange={(e)=> setSearchTerm(e.target.value)} style={{ width: '1060px' }} value={searchTerm}/> 
              : 
              <input type='text' placeholder='Search Here...' className='border-teal-600 rounded-3xl ml-4 mr-4 p-4' onChange={(e)=> setSearchTerm(e.target.value)} value={searchTerm}/>
            }
            
            <button onClick={handleCartToggle} className='flex gap-4 p-2 mr-5 text-3xl items-center justify-end hover:bg-slate-200 '>
            {showCart ? <span className='text-lg '>Back to Shop</span> : <div className='flex flex-col-reverse items-center justify-center'><img src={cart} className='w-14' /></div>}
            </button>
          </div>        
        <div className='overflow-y-auto pb-0' style={{ height: '27rem' }}> 
          {showPrescription ? (
            <DoctorPrescription/>
          ): showCart ? (
            <Cart searchTerm={searchTerm} />
          ) : (
            <div className='grid grid-cols-5 m-5 justify-items-center'>
              {/*
              (parameter) val: {
                id: number;
                title: string;
                image: string;
                price: string;
              }
              */}
              {Data.medicines
                .filter((val)=>{
                  if(searchTerm == "") return val;
                  else if(val.title.toLowerCase().includes(searchTerm.toLowerCase())) return val;
                })
                .map((medicine) => (
                  <Card 
                    key={medicine.id}
                    id={medicine.id}
                    title={medicine.title}
                    image={medicine.image}
                    price={medicine.price}
                  />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
