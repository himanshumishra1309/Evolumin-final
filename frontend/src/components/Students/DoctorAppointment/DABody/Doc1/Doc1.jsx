import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import doctorImage from '../../Images/doc1.jpg';
import axios from 'axios';

const availableDates = [
    new Date(Date.UTC(2024, 8, 5)),
    new Date(Date.UTC(2024, 8, 11)),
    new Date(Date.UTC(2024, 8, 26)),
    new Date(Date.UTC(2024, 8, 28)),
];

const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
];

export default function Doc1() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorData();
    fetchDoctorAvailability();
  }, []);
  
  const studentId = sessionStorage.getItem('studentId');
  const accessToken = sessionStorage.getItem('studentAccessToken');
  
  const fetchDoctorData = async () => {
    try {
      
      const response = await axios.get(`http://localhost:7001/api/v1/fetchDoctor/primary-care-physician/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      sessionStorage.setItem('primaryCarePhysician', response.data.message[0]._id)
      // const primaryCarePhysician = response.data.message[0]._id;
      // console.log(primaryCarePhysician);

      console.log('Doctor experience:', response.data.message[0].experience);

      if (response.status === 200 && response.headers['content-type'].includes('application/json')) {
        setDoctorData(response.data.message[0]);  // store the first object in doctorData
      } else {
        throw new Error("Unexpected content type or response status");
      }
    } catch (error) {
      setError(`Error fetching doctor data: ${error.message}`);
      console.error('Error details:', error);
    }
  };

  const fetchDoctorAvailability = async () => {
    try {
      const primaryCarePhysician = sessionStorage.getItem('primaryCarePhysician');
      const response = await axios.get(`http://localhost:7001/api/v1/appointments/doctors/${primaryCarePhysician}/availability`,{
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // 'Accept': 'application/json'
        }
      });

      console.log('dates response: ', response);
      if (response.status === 200 && response.data.success) {
        setAvailableDates(response.data.data);
      }
    } catch (error) {
      setError(`Error fetching availability: ${error.message}`);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0];
    const selectedDateData = availableDates.find(d => d.date === formattedDate);
    setAvailableTimes(selectedDateData ? selectedDateData.slots.filter(slot => !slot.isBooked) : []);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Booking appointment:', { selectedDate, selectedTime, symptoms });
    // Implement appointment booking logic here
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      if (availableDates.some(d => d.date === formattedDate)) {
        return 'text-black font-bold text-2xl';
      }
      return 'text-gray-300';
    }
    return null;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex gap-20 items-center justify-center">
        <div className="flex flex-col items-center">
          <img src={doctorImage} alt="Doctor" className="w-80 h-80 rounded-2xl" />
          <p>{doctorData?.qualification || 'M.B.B.S in PCP'}</p>
          <p>{doctorData?.currently_working || '(AIIMS Delhi)'}</p>
        </div>
        <div className="flex flex-col items-start mb-5">
          <h1 className="text-4xl flex items-baseline text-teal-800 mb-3">
            {doctorData?.name || 'Dr. Mahesh Joshi'}
            <span className="text-lg text-teal-600 ml-2">{doctorData?.experience ? `(${doctorData.experience} experience)` : 'Experience not available'}</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="date" className="mt-2 block">Date</label>
            <Calendar
              className="rounded-2xl font-bold"
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={tileClassName}
            />

            <label htmlFor="time" className="mt-4 block">Time</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option value="" disabled>Select a time</option>
              {availableTimes.map((timeSlot, index) => (
                <option key={index} value={timeSlot.startTime}>
                  {`${timeSlot.startTime} - ${timeSlot.endTime}`}
                </option>
              ))}
            </select>

            <label htmlFor="symptoms" className="mt-4 block">Symptoms</label>
            <input
              type="text"
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
            <button
              type="submit"
              className="mt-4 p-2 px-10 text-xl font-semibold bg-white text-black border border-teal-600 hover:text-white rounded-xl hover:bg-teal-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
