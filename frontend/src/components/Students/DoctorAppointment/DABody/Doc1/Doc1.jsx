import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';
import doctorImage from '../../Images/doc1.jpg';

export default function Doc1() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [error, setError] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);

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
      const response = await axios.get(`http://localhost:7001/api/v1/fetchDoctor/primary-care-physician/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      sessionStorage.setItem('primaryCarePhysician', response.data.message[0]._id);
      setDoctorData(response.data.message[0]);
    } catch (error) {
      setError(`Error fetching doctor data: ${error.message}`);
      console.error('Error details:', error);
    }
  };

  const fetchDoctorAvailability = async () => {
    try {
      const primaryCarePhysician = sessionStorage.getItem('primaryCarePhysician');
      const response = await axios.get(`http://localhost:7001/api/v1/appointments/doctors/${primaryCarePhysician}/availability`, {
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

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(new Date(formattedDate));
    updateAvailableTimes(formattedDate);
  };

  const handleDropdownChange = (event) => {
    const selectedDropdownDate = event.target.value;
    setSelectedDate(new Date(selectedDropdownDate));
    updateAvailableTimes(selectedDropdownDate);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !symptoms) {
      setError('Please fill in all fields');
      return;
    }

    const [startTime, endTime] = selectedTime.split(' - ');
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    try {
      const primaryCarePhysician = sessionStorage.getItem('primaryCarePhysician');
      const response = await axios.post(
        `http://localhost:7001/api/v1/appointments/doctors/${primaryCarePhysician}/book`,
        {
          studentId,
          date: formattedDate,
          startTime,
          endTime,
          symptoms
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        const appointmentData = response.data.data;
        setBookedAppointment(appointmentData);
        localStorage.setItem('bookedAppointment', JSON.stringify(appointmentData));
        setError(null);
      }
    } catch (error) {
      setError(`Error booking appointment: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      // Implement the cancellation logic here
      // For now, we'll just clear the local storage and state
      localStorage.removeItem('bookedAppointment');
      setBookedAppointment(null);
    } catch (error) {
      setError(`Error cancelling appointment: ${error.message}`);
    }
  };

  if (bookedAppointment) {
    return (
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">Your Booked Appointment</h2>
        <p>Date: {bookedAppointment.date}</p>
        <p>Time: {bookedAppointment.startTime} - {bookedAppointment.endTime}</p>
        <p>Symptoms: {bookedAppointment.symptoms}</p>
        <button
          onClick={handleCancelAppointment}
          className="mt-4 p-2 px-10 text-xl font-semibold bg-white text-black border border-red-600 hover:text-white rounded-xl hover:bg-red-700"
        >
          Cancel Appointment
        </button>
        <p className="mt-4">To modify your appointment, please contact the clinic directly.</p>
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
            <span className="text-lg text-teal-600 ml-2">
              {doctorData?.experience ? `(${doctorData.experience} experience)` : 'Experience not available'}
            </span>
          </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="date" className="mt-2 block">Date</label>
            <select
              id="date"
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              onChange={handleDropdownChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option value="" disabled>Select a date</option>
              {availableDates.map((date, index) => (
                <option key={index} value={date.date}>
                  {new Date(date.date).toDateString()}
                </option>
              ))}
            </select>
            <Calendar
              className="rounded-2xl font-bold mt-4"
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
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
                <option key={index} value={`${timeSlot.startTime} - ${timeSlot.endTime}`}>
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
              Book Appointment
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}