import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageCircle, ArrowLeft, Clock } from 'lucide-react';
import SChat from './Chat/SChat';
import SDdata from './Data/Data.json';
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:3005");

export default function DoctorAdvice() {
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [room, setRoom] = useState(null);

  const handleChat = (name, id) => {
    setSelectedName(name);
    if (id) {
      setRoom(id);
      socket.emit("joined_room", id);
      setChatVisible(true);
    }
  };

  const handleBack = () => {
    setChatVisible(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='m-10 bg-white p-6'
    >
      <h1 className='text-4xl font-bold text-teal-600 mb-8' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Dr. Advice
      </h1>
      <AnimatePresence mode="wait">
        {chatVisible ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <SChat handle={handleBack} name={selectedName} socket={socket} room={room} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className='w-full border rounded-xl flex flex-col overflow-y-auto scrollbar-custom'
            style={{ maxHeight: '35rem' }}
          >
            {SDdata.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03, backgroundColor: '#E6F7FF' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChat(item.name, item.id)}
                className='flex items-center justify-between mx-4 my-3 border rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition-colors duration-200 shadow-sm'
              >
                <div className='flex items-center gap-5'>
                  <div className='bg-teal-100 rounded-full p-3 shadow-md'>
                    <User className="text-teal-600 w-8 h-8" />
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
                      {item.name}
                    </h2>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <p>{item.query}</p>
                      <span>•</span>
                      <div className='flex items-center'>
                        <Clock className='w-4 h-4 mr-1 text-gray-500' />
                        <p>{item.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='relative'>
                  <MessageCircle className="text-teal-600 w-6 h-6" />
                  <motion.span 
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className='absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3'
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
