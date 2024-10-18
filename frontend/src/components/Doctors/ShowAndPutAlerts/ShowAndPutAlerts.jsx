import React, { useState } from 'react';

function ShowAndPutAlerts({ onClose }) {
  const [alertMessage, setAlertMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendAlert = () => {
    if (alertMessage.trim() !== '') {
      setMessages([...messages, alertMessage]);
      setAlertMessage(''); // Clear the input after sending the alert
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
      <div className="bg-white w-1/2 h-3/4 rounded-lg shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>
        
        {/* Title */}
        <h3 className="text-2xl font-semibold mb-6 text-center">Alerts</h3>

        {/* Messages List */}
        <ul className="flex-grow overflow-y-auto mb-4 border p-4 rounded-lg h-2/3">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No Alerts Yet!</p>
          ) : (
            messages.map((msg, index) => (
              <li key={index} className="bg-gray-100 p-2 my-2 rounded-lg">
                {msg}
              </li>
            ))
          )}
        </ul>

        {/* Input and Send Button */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
            className="flex-grow border p-2 rounded-lg"
            placeholder="Type your alert message"
          />
          <button
            onClick={handleSendAlert}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowAndPutAlerts;
