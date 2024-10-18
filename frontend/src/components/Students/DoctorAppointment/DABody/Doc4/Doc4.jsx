import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import doctorImage from '../../Images/Doc4.jpg'; // Ensure the doctor image path is correct
import DAHeader from '../../DAHeader/DAHeader';

const availableDates = [
  new Date(Date.UTC(2024, 8, 5)),
  new Date(Date.UTC(2024, 8, 11)), // July 6, 2024
  new Date(Date.UTC(2024, 8, 26)), // July 13, 2024
  new Date(Date.UTC(2024, 8, 28)), // July 20, 2024
];

const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
];

function Doc4() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    if (availableDates.some((availableDate) => availableDate.toDateString() === utcDate.toDateString())) {
      setSelectedDate(utcDate);
    } else {
      alert('Doctor is not available on this date');
    }
  };

  const handleDateSelect = (event) => {
    const date = new Date(event.target.value);
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedDate(utcDate);
  };

  const handleTimeSelect = (event) => {
    setSelectedTime(event.target.value);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      if (availableDates.some((availableDate) => availableDate.toDateString() === utcDate.toDateString())) {
        return 'text-black';
      }
      return 'text-gray-400';
    }
    return null;
  };

  return (
    <div>
      <div className='p-10'>
        <div className='flex gap-20 items-center justify-center'>
          <div className='flex flex-col items-center'>
            <img src={doctorImage} className='size-80 rounded-2xl'/>
            <p>M.B.B.S in Dermatology</p>
            <p>(AIIMS Bhopal)</p>
          </div>
          <div className="flex flex-col items-start mb-5">
            <h1 className='text-4xl flex items-baseline text-teal-800 mb-3' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Dr. Varsha Thakkar<p className='text-lg text-teal-600' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>(IRIS HOSPITAL)</p></h1>
            <label htmlFor="date" className="mt-2">Date</label>
            <select
              id="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={handleDateSelect}
              className="mt-1 p-2 border border-gray-300 rounded w-1/2"
            >
              <option value="" disabled>Select a date</option>
              {availableDates.map((date, index) => (
                <option key={index} value={date.toISOString().split('T')[0]}>
                  {date.toDateString()}
                </option>
              ))}
            </select>

            <label htmlFor="time" className="mt-4">Time</label>
            <select
              id="time"
              value={selectedTime}
              onChange={handleTimeSelect}
              className="mt-1 p-2 border border-gray-300 rounded w-1/2"
            >
              <option value="" disabled>Select a time</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>

            <label htmlFor="symptoms" className="mt-4">Symptoms</label>
            <input
              type="text"
              id="symptoms"
              className="mt-1 p-2 border border-gray-300 rounded w-1/2"
            />
            <button
              type="submit"
              className="mt-4 p-2 px-10 text-xl font-semibold bg-white text-black border-teal-600 hover:text-white rounded-xl hover:bg-teal-700"
            >
              Submit
            </button>
          </div>
          <div className="">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={tileClassName}
            />
        </div>
        </div>
      </div>
    </div>
  )
}

export default Doc4
