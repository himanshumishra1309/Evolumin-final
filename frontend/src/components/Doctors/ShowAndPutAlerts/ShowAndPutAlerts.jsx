import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ShowAndPutAlerts({ onClose }) {
  const [alertMessage, setAlertMessage] = useState('');
  const [alerts, setAlerts] = useState([]);

  // Fetch alerts on component load
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const accessToken = sessionStorage.getItem('doctorAccessToken');
        const headers = {
          "Authorization": `Bearer ${accessToken}`
        };
        const response = await axios.get('http://localhost:7001/api/v1/alerts/alerts-doc', { headers });
        console.log('Fetched Alerts doctor side:', response.data);
        setAlerts(response.data.data);
      } catch (error) {
        console.error("Error fetching alerts:", error.response?.data?.message || error.message);
      }
    };
    fetchAlerts();
  }, []);
  
  const userId = sessionStorage.getItem('doctorId');
  
  // Send a new alert
  const handleSendAlert = async () => {
    if (alertMessage.trim() !== '') {
      try {
        const accessToken = sessionStorage.getItem('doctorAccessToken');
        const headers = {
          "Authorization": `Bearer ${accessToken}`
        };
        const response = await axios.post(`http://localhost:7001/api/v1/alerts/doctors/${userId}/alert`, { message: alertMessage }, { headers });
        console.log('Sent Alerts doctor side:', response.data);
        setAlerts([response.data.data, ...alerts]);
        setAlertMessage(''); // Clear the input
      } catch (error) {
        console.error("Error sending alert:", error.response?.data?.message || error.message);
      }
    }
  };

  // Edit an alert
  const handleEditAlert = async (alertId, updatedMessage) => {
    try {
      const accessToken = sessionStorage.getItem('doctorAccessToken');
        const headers = {
          "Authorization": `Bearer ${accessToken}`
        };
      const response = await axios.put(`http://localhost:7001/api/v1/alerts/alerts/${alertId}`, { message: updatedMessage }, { headers });
      console.log('Edited Alerts doctor side:', response.data);
      setAlerts(alerts.map(alert => alert._id === alertId ? response.data.data : alert));
    } catch (error) {
      console.error("Error editing alert:", error.response?.data?.message || error.message);
    }
  };

  // Delete an alert
  const handleDeleteAlert = async (alertId) => {
    try {
      const accessToken = sessionStorage.getItem('doctorAccessToken');
        const headers = {
          "Authorization": `Bearer ${accessToken}`
        };
      await axios.delete(`http://localhost:7001/api/v1/alerts/alerts/${alertId}`, { headers });
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (error) {
      console.error("Error deleting alert:", error.response?.data?.message || error.message);
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
          {alerts.length === 0 ? (
            <p className="text-center text-gray-500">No Alerts Yet!</p>
          ) : (
            alerts.map((alert) => (
              <li key={alert._id} className="bg-gray-100 p-2 my-2 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{alert.owner.name}</p>
                    <p className="text-sm text-gray-500">{new Date(alert.createdAt).toLocaleString()}</p>
                    <p>{alert.message}</p>
                  </div>
                  {alert.owner._id === userId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updatedMessage = prompt("Edit your message:", alert.message);
                          if (updatedMessage && updatedMessage !== alert.message) {
                            handleEditAlert(alert._id, updatedMessage);
                          }
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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
