import React, { useEffect, useState, useRef, useContext } from 'react';
import profile from '../../../../svgs/profile.svg';
import pill from '../../../../svgs/pill.svg';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import './chat.css';
import PillsSuggestion from '../PillsSuggestions/PillsSuggestion';
import { Context } from '../../../../Context/Context';
import ViewPrescription from '../ViewPrescription/ViewPrescription';

function Chat({ handle, name, socket, room}) {
  const { suggestedPills } = useContext(Context);
  const [viewPills, setViewPills] = useState(false);
  const [prescribedPills, setPrescribedPills] = useState(false);
  const [chat, setChat] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [messages, setMessages] = useState([]);
  const mainRef = useRef(null);
  const textareaRef = useRef(null);
  const pillsRef = useRef(null);

  const handlePills = () => {
    if (viewPills) {
      // If pills suggestion is currently visible, hide it and show the chat
      setViewPills(false);
      setChat(true);
      setPrescribedPills(false);
    } else {
      // If pills suggestion is not visible, show it and hide the chat
      setViewPills(true);
      setChat(false);
      setPrescribedPills(false);
    }
  };
  
  
  
  const handleBackClick = () => {
    if (prescribedPills) {
      setPrescribedPills(false);
      setChat(true);
    } else if (viewPills) {
      setViewPills(false);
      setChat(true);
    }
  };

  const handlePrescribedPills = () => {
    setPrescribedPills(true);  // Show the prescribed pills view
    setChat(false);            // Hide the chat view
    setViewPills(false);       // Hide the pills suggestion view
  };
  

  const handleChat = (message, className, isPrescription = false) => {
    const newMessage = { message, className, isPrescription };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (isPrescription) {
      setMedicines([]); // Clear medicines after sending the prescription
    }

    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollTop = mainRef.current.scrollHeight;
      }
    }, 0); // Ensure chat scrolls to the bottom
  };

  const handleSendClick = () => {
    const message = textareaRef.current.value.trim();
  
    if (viewPills && suggestedPills.length > 0) {
      const prescriptionData = { room, message: "Prescription Sent", medicines: suggestedPills, author: name };
      socket.emit("send_prescription", prescriptionData);
      handleChat("Prescription sent", 'outgoing', true);
      setViewPills(false); // Hide the pills suggestion view
      setChat(true);       // Show the chat section
    } else if (message) {
      const messageData = { room, message, author: name};
      socket.emit("send_message", messageData);
      handleChat(message, 'outgoing');
    }
  
    textareaRef.current.value = ''; // Clear the textarea after sending the message
    setViewPills(false);  // Ensure pills suggestion view is closed
    setChat(true);        // Ensure the chat section is visible
  };
  

  useEffect(() => {
    socket.on("receive_message", (data)=>{
      console.log(data);
      if(data.author !== name){
        console.log(data);
        handleChat(data.message, 'incoming');
      }
    })
    const handleClickOutside = (event) => {
      if (pillsRef.current && !pillsRef.current.contains(event.target) && !event.target.closest('.cursor-pointer')) {
        setViewPills(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='w-full'>
      <header className='w-full sticky border shadow-b-2xl mt-0'>
        <nav className='w-full flex justify-between pl-10 pr-10 pt-3 pb-3'>
          <div className='flex justify-center items-center gap-6'>
            <FaArrowLeft onClick={handle} className='cursor-pointer size-8' aria-label="Go back" />
            <img src={profile} alt="Profile icon" className='size-14' />
            <h1 className='flex text-4xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{name}</h1>
          </div>
          <div>
            <img src={pill} alt="Pill" onClick={handlePills} className='cursor-pointer' />
          </div>
        </nav>
      </header>
      <main className='h-96 border overflow-y-auto p-5 scrollbar-custom relative overflow-x-hidden' ref={mainRef}>
        {chat && !viewPills && !prescribedPills && (
          <ul className="chatbox">
            {messages.map((msg, index) => (
              <li key={index} className={`chat ${msg.className}`}>
                {msg.className === 'incoming' && <img src={profile} alt="Profile" className='size-10' />}
                <p style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
                  {msg.message}
                  <br/>
                  {msg.isPrescription && (
                    <button className='view-button w-full border-2 border-slate-200 p-2 bg-teal-100 text-slate-400' onClick={handlePrescribedPills}>
                      View
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
        {!chat && viewPills && !prescribedPills && (
          <PillsSuggestion
            medicines={medicines}
            setMedicines={setMedicines}
            readOnly={false}  // Changed to false to allow adding/editing medicines
            socket={socket}
          />
        )}
        {!chat && !viewPills && prescribedPills && (
          <ViewPrescription onBack={handleBackClick} />
        )}
      </main>
      <div className="w-full flex items-center gap-4">
        <textarea
          placeholder="Enter the message here.."
          required
          className='w-full border p-2 rounded-3xl text-2xl'
          ref={textareaRef}
        />
        <button id="sent-btn" className='border-none' onClick={handleSendClick}>
          <FaPaperPlane className='size-12 cursor-pointer mr-3' aria-label="Send message" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
