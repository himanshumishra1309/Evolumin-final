import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageSquare, ArrowLeft } from 'lucide-react';
import Chat from './Chat/Chat';
import ChatData from './Data/Data.json';
import '../Appointments/scrollbar.css';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3005");

function Queries() {
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
      className='m-10 pt-20'
    >
      <div className='w-full bg-white rounded-lg shadow-lg p-6'>
        <h1 className='text-4xl font-bold text-teal-600 mb-8' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
          Queries
        </h1>
        <AnimatePresence mode="wait">
          {chatVisible ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Chat handle={handleBack} name={selectedName} socket={socket} room={room}/>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className='w-full border rounded-3xl flex flex-col overflow-y-auto scrollbar-custom'
              style={{ maxHeight: '35rem' }}
            >
              {ChatData.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChat(item.name, item.id)}
                  className='flex items-center justify-between mx-4 my-3 border rounded-xl p-4 cursor-pointer hover:bg-teal-50 transition-colors duration-200'
                >
                  <div className='flex items-center gap-5'>
                    <User className="text-teal-600 w-10 h-10" />
                    <div>
                      <h2 className='text-xl font-semibold' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{item.name}</h2>
                      <div className='flex gap-2 text-sm text-gray-600'>
                        <p>{item.query} | </p>
                        <p>{item.time}</p>
                      </div>
                    </div>
                  </div>
                  <MessageSquare className="text-teal-600 w-6 h-6" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Queries;