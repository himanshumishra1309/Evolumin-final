import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaTimes } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css'; // Ensure you import the calendar CSS
import './doc.css'
import { Context } from '../../../Context/Context';

function DocShift() {
  const { setShifts } = useContext(Context);
  const [marked, setMarked] = useState([]);
  const [shiftDate, setShiftDate] = useState(false);
  const [cancelShiftDate, setCancelShiftDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [nextShift, setNextShift] = useState(null);

  useEffect(() => {
    // Load stored dates from localStorage
    const storedDates = JSON.parse(localStorage.getItem('confirmShiftDates')) || [];
    setMarked(storedDates);

    // Determine the next shift
    const futureDates = storedDates.filter(date => new Date(date) > new Date());
    futureDates.sort((a, b) => new Date(a) - new Date(b));

    if (futureDates.length > 0) {
      const nextShiftDate = futureDates[0];
      const shiftTimings = JSON.parse(localStorage.getItem(`shift_${nextShiftDate}`));
      setNextShift({ date: nextShiftDate, ...shiftTimings });
    } else {
      setNextShift(null);
    }
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toLocaleDateString('en-CA');
      if (marked.includes(dateString)) {
        return 'highlight'; // Add your highlight class here
      }
    }
    return null;
  };

  const handleClick = (date) => {
    // console.log({date}); ---> Thu Oct 17 2024 00:00:00 GMT+0530 (India Standard Time)
    const clickedDate = date.toLocaleDateString('en-CA');
    setSelectedDate(clickedDate);
    // console.log({clickedDate}); ---> ---> 2024-10-17
    // Reset startTime, endTime, and cancelReason each time a new date is clicked
    setStartTime('');
    setEndTime('');
    setCancelReason('');
  
    if (marked.includes(clickedDate)) {
      setCancelShiftDate(true);
    } else {
      setShiftDate(true);
    }
  };
  

  const handleAdd = () => {
    if (startTime && endTime) {
      const updatedDates = [...marked, selectedDate];
      localStorage.setItem('confirmShiftDates', JSON.stringify(updatedDates));
      localStorage.setItem(`shift_${selectedDate}`, JSON.stringify({ startTime, endTime }));
      setMarked(updatedDates);
      setShiftDate(false);

      // Update next shift after adding
      updateNextShift(updatedDates);
    }
  };

  const handleCancel = () => {
    if (cancelReason) {
      const updatedDates = marked.filter(date => date !== selectedDate);
      localStorage.setItem('confirmShiftDates', JSON.stringify(updatedDates));
      localStorage.removeItem(`shift_${selectedDate}`);
      setMarked(updatedDates);
      setCancelShiftDate(false);

      // Update next shift after canceling
      updateNextShift(updatedDates);
    }
  };

  const updateNextShift = (updatedDates) => {
    const futureDates = updatedDates.filter(date => new Date(date) > new Date());
    futureDates.sort((a, b) => new Date(a) - new Date(b));

    if (futureDates.length > 0) {
      const nextShiftDate = futureDates[0];
      const shiftTimings = JSON.parse(localStorage.getItem(`shift_${nextShiftDate}`));
      setNextShift({ date: nextShiftDate, ...shiftTimings });
    } else {
      setNextShift(null);
    }
  };

  return (
    <div className='w-1/3 h-4/5 bg-white rounded-lg flex items-center flex-col gap-12 relative'>
      <FaTimes id="shift" className="absolute top-4 right-4 text-gray-600 cursor-pointer" 
              onClick={()=> setShifts(false)}
              alt='Close prescription modal'
      />
      <div className='w-full flex items-center justify-center mt-10'>
        <Calendar 
          className='rounded-2xl font-semibold text-lg'
          tileClassName={tileClassName}
          onClickDay={handleClick}
          alt="Calender"
        />
      </div>
      <div className='flex flex-col justify-start w-full px-6'>
        <p className='text-left text-2xl font-semibold' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Your Next Shift:</p>
        {nextShift ? (
          <div className='flex flex-col justify-start'>
            <p className='text-left text-2xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              {`${new Date(nextShift.date).toLocaleDateString('en-GB')}`}
            </p>
            <p className='text-left text-2xl'  style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{`Timing: ${nextShift.startTime} - ${nextShift.endTime}`}</p>
          </div>
        ) : (
          <p className='text-left text-2xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>No upcoming shifts</p>
        )}
      </div>
      {shiftDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg relative">
            <FaTimes id="shiftDate" className="absolute top-4 right-4 text-gray-600 cursor-pointer" 
                onClick={() => setShiftDate(false)}
            />
            <h2 className="text-xl font-semibold mb-4">Add Shift</h2>
            <label>Start Time:</label>
            <select className="block mb-2" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              <option value="">Select Start Time</option>
              <option value="08:00">08:00</option>
              <option value="12:00">12:00</option>
              <option value="16:00">16:00</option>
            </select>
            <label>End Time:</label>
            <select className="block mb-4" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
              <option value="">Select End Time</option>
              <option value="12:00">12:00</option>
              <option value="16:00">16:00</option>
              <option value="20:00">20:00</option>
            </select>
            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleAdd}>
              Add Shift
            </button>
          </div>
        </div>
      )}
      {cancelShiftDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg relative">
            <FaTimes id="cancelShiftDate" className="absolute top-4 right-4 text-gray-600 cursor-pointer" 
                onClick={() => setCancelShiftDate(false)}
            />
            <h2 className="text-xl font-semibold mb-4">Cancel Shift</h2>
            <label>Reason for Cancellation:</label>
            <textarea
              className="block w-full mb-4"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleCancel}>
              Cancel Shift
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocShift;
