import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';
import doctorImage from '../../Images/Doc2.jpg';
import { motion, AnimatePresence } from 'framer-motion';

export default function Doc1() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [error, setError] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchDoctorData();
    fetchDoctorAvailability();
    const storedAppointment = localStorage.getItem('bookedAppointment');
    if (storedAppointment) {
      setBookedAppointment(JSON.parse(storedAppointment));
    }
  }, []);

  const studentId = sessionStorage.getItem('studentId');
  const accessToken = sessionStorage.getItem('studentAccessToken');

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/v1/fetchDoctor/dentist/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      sessionStorage.setItem('dentist', response.data.message[0]._id);
      setDoctorData(response.data.message[0]);
    } catch (error) {
      setError(`Error fetching doctor data: ${error.message}`);
      console.error('Error details:', error);
    }
  };

  const fetchDoctorAvailability = async () => {
    try {
      const dentist = sessionStorage.getItem('dentist');
      const response = await axios.get(`http://localhost:7001/api/v1/appointments/doctors/${dentist}/availability`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (response.status === 200 && response.data.success) {
        const formattedDates = response.data.data.map((date) => ({
          ...date,
          date: new Date(date.date).toISOString().split('T')[0],
        }));
        setAvailableDates(formattedDates);
      }
    } catch (error) {
      setError(`Error fetching availability: ${error.message}`);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (selectedDate && selectedTime && symptoms) {
      // Add form submission logic, e.g., sending data to the backend
      console.log("Form Submitted:", {
        date: selectedDate,
        time: selectedTime,
        symptoms,
      });
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleDateChange = (date) => {
    const selectedDateString = format(date, 'yyyy-MM-dd');
    const isDateAvailable = availableDates.some((dateObj) => dateObj.date === selectedDateString);

    if (isDateAvailable) {
      setSelectedDate(date);
      updateAvailableTimes(selectedDateString);
    } else {
      setShowPopup(true);
    }
  };

  const updateAvailableTimes = (formattedDate) => {
    const selectedDateData = availableDates.find(d => d.date === formattedDate);
    setAvailableTimes(selectedDateData ? selectedDateData.slots.filter(slot => !slot.isBooked) : []);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      if (availableDates.some(d => d.date === formattedDate)) {
        return 'text-black font-bold text-2xl';
      }
      return 'text-gray-300';
    }
    return null;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      return !availableDates.some(d => d.date === formattedDate);
    }
    return false;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-10"
    >
      <div className="flex gap-10 items-start justify-center">
        {/* Doctor Info */}
        <motion.div 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col items-center text-center"
        >
          <img src={doctorImage} alt="Doctor" className='size-80 rounded-2xl' />
          <p className="text-lg font-semibold">{doctorData?.qualification || 'M.B.B.S in PCP'}</p>
          <p className="text-sm text-gray-500">{doctorData?.currently_working || '(AIIMS Delhi)'}</p>
        </motion.div>

        {/* Appointment Form */}
        <motion.div 
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col items-start"
        >
          <h1 className="text-4xl text-teal-800 font-bold mb-3" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
            {doctorData?.name || 'Dr. Mahesh Joshi'}
            <span className="text-lg text-teal-600 ml-2" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              {doctorData?.experience ? `(${doctorData.experience} experience)` : 'Experience not available'}
            </span>
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full">
            {/* Date Selection */}
            <label htmlFor="date" className="mt-2 block text-gray-700">Date</label>
            <select
              id="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              className="mt-1 p-2 border border-gray-300 rounded w-full max-w-md"
            >
              <option value="" disabled>Select a date</option>
              {availableDates.map((dateObj, index) => (
                <option key={index} value={dateObj.date}>
                  {new Date(dateObj.date).toDateString()}
                </option>
              ))}
            </select>

            {/* Time Selection */}
            <label htmlFor="time" className="mt-4 block text-gray-700">Time</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full max-w-md"
              required
            >
              <option value="" disabled>Select a time</option>
              {availableTimes.map((timeSlot, index) => (
                <option key={index} value={timeSlot.startTime}>
                  {`${timeSlot.startTime} - ${timeSlot.endTime}`}
                </option>
              ))}
            </select>

            {/* Symptoms Input */}
            <label htmlFor="symptoms" className="mt-4 block text-gray-700">Symptoms</label>
            <input
              type="text"
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full max-w-md"
              required
            />
            
            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 p-2 px-10 text-xl font-semibold bg-white text-black border border-teal-600 hover:text-white rounded-xl hover:bg-teal-700"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>

        {/* Calendar Component */}
        <motion.div 
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex-shrink-0"
        >
          <Calendar
            onChange={(date) => handleDateChange(date)}
            value={selectedDate}
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
          />
        </motion.div>
      </div>

      {/* Popup for unavailable dates */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowPopup(false)}
          >
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold mb-4">Date Unavailable</h2>
              <p>The selected date is not available for appointments.</p>
              <p>Please choose another date from the calendar.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                onClick={() => setShowPopup(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}