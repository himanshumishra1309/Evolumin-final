import React, { useState, useEffect, useRef, useContext } from 'react';
import profile from '../../../svgs/profile.svg';
import chat from '../../../svgs/chat.svg';
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
    <div className='m-10 pt-20'>
      <div className='w-full'>
        <h1 className='m-6 text-4xl font-bold text-teal-600 mb-4 underline' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Queries</h1>
        <div className='w-full border rounded-3xl flex flex-col overflow-y-auto scrollbar-custom' style={{ maxHeight: '35rem' }}>
          {chatVisible ? (
            <Chat handle={handleBack} name={selectedName} socket={socket} room={room}/>
          ) : (
            <>
              {ChatData.map((item) => (
                <div key={item.id} onClick={() => handleChat(item.name, item.id)} className='flex items-center justify-between mx-10 my-3 border rounded-xl p-4 cursor-pointer hover:bg-slate-100'>
                  <div className='flex items-center gap-5'>
                    <img src={profile} className='size-14' alt="Profile icon" />
                    <div>
                      <h1 className='text-3xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{item.name}</h1>
                      <div className='flex gap-2'>
                        <p style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{item.query} | </p>
                        <p style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{item.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex relative'>
                    <img src={chat} className='size-12' alt="Chat Icon" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Queries;
