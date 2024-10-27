import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Card from './Card/Card';
import './scrollbar.css';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const doctorId = sessionStorage.getItem('doctorId');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const accessToken = sessionStorage.getItem('doctorAccessToken');
        const headers = { "Authorization": `Bearer ${accessToken}` };
        const response = await axios.get(`http://localhost:7001/api/v1/appointments/doctors/${doctorId}/appointments`, { headers });
        
        const appointmentsData = response.data.data;
        setAppointments(appointmentsData);

        const dates = Array.from(new Set(appointmentsData.map(appointment => appointment.date)));
        setUniqueDates(dates.sort());

      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data?.message || error.message);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredAppointments = selectedDate
    ? appointments.filter(appointment => appointment.date === selectedDate)
    : appointments;

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
    return timeA[1] - timeB[1];
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='m-8 bg-white rounded-lg shadow-lg p-6'
    >
      <h1 className='text-4xl font-bold text-teal-600 mb-8' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Appointments
      </h1>
      <div className='flex justify-end items-center mb-6'>
        <Calendar className="mr-2 text-teal-600" />
        <select 
          className='w-auto border rounded-lg text-xl cursor-pointer p-2 focus:outline-none focus:ring-2 focus:ring-teal-500'
          onChange={handleDateChange}
          value={selectedDate}
        >
          <option value="">All Dates</option>
          {uniqueDates.map((date, index) => (
            <option key={index} value={date}>
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </option>
          ))}
        </select>
      </div>
      <motion.div 
        className='w-full overflow-x-auto flex gap-4 p-4 scrollbar-custom'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment, index) => (
            <Card
              key={index}
              index={index}
              name={appointment.studentName}
              date={appointment.date}
              time={`${appointment.startTime} - ${appointment.endTime}`}
              symptoms={appointment.symptoms}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 text-xl w-full py-8">No Appointments Found</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Appointments;