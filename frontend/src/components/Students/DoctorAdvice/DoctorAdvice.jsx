import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageCircle, ArrowLeft, Clock, Send } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io.connect("http://localhost:3005");

// Simulated chat data (replace with actual data fetching logic)
const SDdata = [
  { id: 1, name: "Dr. Smith", query: "General Consultation", time: "10:30 AM" },
  { id: 2, name: "Dr. Johnson", query: "Cardiology", time: "11:45 AM" },
  { id: 3, name: "Dr. Williams", query: "Pediatrics", time: "2:15 PM" },
];

const ChatBubble = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div
      className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
        isUser
          ? 'bg-teal-600 text-white'
          : 'bg-teal-100 text-teal-800'
      }`}
    >
      <p>{message.text}</p>
      <p className={`text-xs mt-1 ${isUser ? 'text-teal-200' : 'text-teal-600'}`}>
        {message.time}
      </p>
    </div>
  </motion.div>
);

const SChat = ({ handle, name, socket, room }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: `Hello! How can I assist you today?`, time: '10:30 AM', isUser: false },
  ]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { text: message, time: new Date().toLocaleTimeString(), isUser: true };
      setChatHistory([...chatHistory, newMessage]);
      socket.emit("send_message", { message, room });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handle}
          className="mr-4 p-2 rounded-full bg-teal-100 text-teal-600"
        >
          <ArrowLeft />
        </motion.button>
        <h2 className="text-2xl font-semibold text-teal-600">{name}</h2>
      </div>
      <div className="flex-grow overflow-y-auto mb-4 p-4 border border-teal-200 rounded-lg">
        <AnimatePresence>
          {chatHistory.map((msg, index) => (
            <ChatBubble key={index} message={msg} isUser={msg.isUser} />
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-2 bg-teal-600 text-white rounded-lg"
        >
          <Send />
        </motion.button>
      </form>
    </div>
  );
};

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
      className='m-10 bg-white rounded-lg shadow-lg p-6'
    >
      <h1 className='text-4xl font-bold text-teal-600 mb-8' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Dr. Advice
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
            <SChat handle={handleBack} name={selectedName} socket={socket} room={room} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='w-full border rounded-xl flex flex-col overflow-y-auto scrollbar-custom'
            style={{ maxHeight: '35rem' }}
          >
            {SDdata.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChat(item.name, item.id)}
                className='flex items-center justify-between mx-4 my-3 border rounded-xl p-4 cursor-pointer hover:bg-teal-50 transition-colors duration-200'
              >
                <div className='flex items-center gap-5'>
                  <div className='bg-teal-100 rounded-full p-3'>
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
                        <Clock className='w-4 h-4 mr-1' />
                        <p>{item.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='relative'>
                  <MessageCircle className="text-teal-600 w-6 h-6" />
                  <span className='absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3'></span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}