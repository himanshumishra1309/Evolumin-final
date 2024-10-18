import React, { useEffect, useRef, useState, useContext } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { Context } from '../../../../Context/Context';
import profile from '../../../../svgs/profile.svg';
import ViewDocPrecription from '../ViewDocPrecription/ViewDocPrecription';

function SChat({ handle, name, socket, room }) {
    const {suggestedPills} = useContext(Context);
    const mainRef = useRef(null);
    const [chat, setChat] = useState(true);
    const [prescriptionData, setPrescriptionData] = useState(null);
    const [messages, setMessages] = useState([]); // Store chat messages

    const handleChat = (message, className, isPrescription = false) => {
        const newMessage = { message, className, isPrescription };
        setMessages(prevMessages => [...prevMessages, newMessage]); // Save to state

        // Only add to DOM if chat is currently active
        if (chat) {
            addMessageToDOM(newMessage);
        }
    };

    const addMessageToDOM = ({ message, className, isPrescription }) => {
        const chatLi = document.createElement('li');
        chatLi.classList.add('chat', className);

        let chatContent = className === 'outgoing'
            ? '<p></p>'
            : `<img src="${profile}" style="width: 40px; height: 40px;" />
           <p></p>`;

        chatLi.innerHTML = chatContent;
        const pElement = chatLi.querySelector('p');
        pElement.textContent = message;

        if (isPrescription) {
            // Create the wrapper div for the prescription message and view button
            const prescriptionWrapper = document.createElement('div');
            prescriptionWrapper.classList.add(
                'flex',              // Use flexbox for alignment
                'flex-col',          // Align items vertically
                'items-center',      // Center items horizontally
                'gap-2',             // Add some space between text and button
                'bg-gray-100',
                'text-white',        // Text color for the wrapper
                'p-4',               // Padding for the wrapper
                'rounded-lg',        // Rounded corners for the wrapper
                'shadow-md',         // Add a subtle shadow for better visual separation
                'max-w-xs'           // Limit the max width of the box
            );
        
            // Set the text to "Prescription received"
            pElement.textContent = 'Prescription received';
        
            // Style for the pElement
            pElement.classList.add(
                'font-bold',         // Bold text for better emphasis
                'text-lg',           // Larger text size
                'mb-2'               // Margin at the bottom to separate from the button
            );
        
            // Create the View button
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.classList.add(
                'view-button',
                'p-2',
                'bg-cyan-100',        // Soft background color for the button (adjust as needed)
                'text-gray-600',      // Text color for the button
                'rounded-md',         // Rounded corners for the button
                'hover:bg-cyan-200',  // Slightly darker on hover
                'transition',         // Smooth transition effect
                'duration-300',       // Duration of the transition
                'ease-in-out',        // Easing for the transition
                'w-full'              // Make the button full width
            );
        
            // Add event handler for the View button
            viewButton.onclick = () => {
                setChat(false); // Show prescription view when clicked
                const storedPills = JSON.parse(localStorage.getItem('doctors-prescription'));
                setPrescriptionData(storedPills); // Retrieve the prescription data to view
            };
        
            // Append the text and button to the wrapper
            prescriptionWrapper.appendChild(pElement);
            prescriptionWrapper.appendChild(viewButton);
        
            // Append the wrapper to the chat list item
            chatLi.appendChild(prescriptionWrapper);
        }
        
        

        document.querySelector('.chatbox').appendChild(chatLi);
        document.querySelector('.chatbox').scrollTop = document.querySelector('.chatbox').scrollHeight;
        document.querySelector('textarea').value = ''; // Clear the textarea
    };

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            if (data.author !== name) {
                handleChat(data.message, 'incoming', data.isPrescription);
            }
        };

        const handleReceivePrescription = (data) => {
            if (data.author !== name) {
                // Save the received prescription to localStorage
                localStorage.setItem('doctors-prescription', JSON.stringify(data.medicines));
                console.log('Prescription stored:', data.medicines); // Log the prescription data
                handleChat(data.message, 'incoming', true);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('receive_prescription', handleReceivePrescription);

        const sendButton = document.getElementById('sent-btn');
        const handleSendClick = () => {
            const textarea = document.querySelector('textarea');
            const message = textarea.value.trim();
            if (message) {
                const messageData = { room, message, author: name };
                socket.emit("send_message", messageData);
                handleChat(message, 'outgoing');
            }
        };

        sendButton.addEventListener('click', handleSendClick);

        // Re-add stored messages to DOM when chat is active
        if (chat) {
            messages.forEach(addMessageToDOM);
        }

        return () => {
            sendButton.removeEventListener('click', handleSendClick);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("receive_prescription", handleReceivePrescription);
        };
    }, [socket, name, chat]); // Depend on chat state to re-render messages

    return (
        <div className='w-full'>
            <header className='w-full sticky border shadow-b-2xl mt-0'>
                <nav className='w-full flex justify-between pl-10 pr-10 pt-3 pb-3'>
                    <div className='flex justify-center items-center gap-6'>
                        <FaArrowLeft onClick={handle} className='cursor-pointer size-8' />
                        <img src={profile} className='size-14' />
                        <h1 className='flex text-4xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{name}</h1>
                    </div>
                </nav>
            </header>
            <main className='h-96 border overflow-y-auto p-5 scrollbar-custom relative overflow-x-hidden' ref={mainRef}>
                {chat ? (
                    <ul className="chatbox h-full overflow-y-auto scrollbar-custom " style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}/>
                ) : (
                    <ViewDocPrecription onBack={() => setChat(true)} prescriptionData={prescriptionData} />
                )}
            </main>
            <div className="w-full flex items-center gap-4">
                <textarea placeholder="Enter the message here.." required className='w-full border p-2 rounded-3xl text-2xl' />
                <button id="sent-btn" className='border-none'>
                    <FaPaperPlane className='size-12 cursor-pointer mr-3' />
                </button>
            </div>
        </div>
    );
}

export default SChat;
