import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  // Fetch alerts every 5 seconds
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const accessToken = sessionStorage.getItem('studentAccessToken');
        const headers = {
          "Authorization": `Bearer ${accessToken}`
        };
        const response = await axios.get('http://localhost:7001/api/v1/alerts/alerts-stu', { headers });
        console.log('Fetched Alerts student side:', response.data);
        setAlerts(response.data.data);
      } catch (error) {
        console.error("Error fetching alerts:", error.response?.data?.message || error.message);
      }
    };

    fetchAlerts(); // Initial fetch on component load
    const intervalId = setInterval(fetchAlerts, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="w-full px-10 pb-10">
      <h1 className="m-6 text-4xl font-bold text-teal-600 mb-4 underline" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Alerts
      </h1>
      
      <div className="w-full flex justify-center items-center border h-96 rounded-2xl mt-4">
        {alerts.length === 0 ? (
          <span className="text-5xl font-bold text-gray-400">No Alerts Yet!!!</span>
        ) : (
          <ul className="w-full max-h-full overflow-y-auto p-6 space-y-4">
            {alerts.map(alert => (
              <li key={alert._id} className="bg-gray-100 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{alert.owner.name}</p>
                    <p className="text-sm text-gray-500">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="mt-2">{alert.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Alerts;
