import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card/Card';
import './scrollbar.css';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const doctorId = sessionStorage.getItem('doctorId');

  // Fetch appointments for the logged-in doctor on component load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const accessToken = sessionStorage.getItem('doctorAccessToken');
        const headers = { "Authorization": `Bearer ${accessToken}` };
        const response = await axios.get(`http://localhost:7001/api/v1/appointments/doctors/${doctorId}/appointments`, { headers });
        
        const appointmentsData = response.data.data;
        setAppointments(appointmentsData);

        // Extract unique dates from appointments
        const dates = Array.from(new Set(appointmentsData.map(appointment => appointment.date)));
        setUniqueDates(dates.sort());  // Sort dates if needed

      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data?.message || error.message);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter appointments by selected date
  const filteredAppointments = selectedDate
    ? appointments.filter(appointment => appointment.date === selectedDate)
    : appointments;

  // Sort filtered appointments by time
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
    return timeA[1] - timeB[1];
  });

  return (
    <div className='m-8'>
      <h1 className='m-6 mt-10 pt-6 text-4xl font-bold text-teal-600 mb-4 underline' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Appointments</h1>
      <div className='flex justify-end'>
        <p className='text-2xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Filter: </p>
        <select className='w-auto border rounded-lg text-xl cursor-pointer' onChange={handleDateChange}>
          <option className='cursor-pointer' value="" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>All</option>
          {uniqueDates.map((date, index) => (
            <option
              key={index}
              value={date}
              style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}
            >
              {new Date(date).toDateString()}
            </option>
          ))}
        </select>
      </div>
      <div className='w-full h-1/2 overflow-x-auto flex gap-4 p-4 scrollbar-custom'>
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
          <p className="text-center text-gray-500">No Appointments Found</p>
        )}
      </div>
    </div>
  );
}

export default Appointments;
