import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios'; // Make sure to install axios
import 'react-calendar/dist/Calendar.css';
import './doc.css';
import { Context } from '../../../Context/Context';

function DocShift() {
  const { setShifts } = useContext(Context);
  const [marked, setMarked] = useState([]);
  const [shiftDate, setShiftDate] = useState(false);
  const [cancelShiftDate, setCancelShiftDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [nextShift, setNextShift] = useState(null);

  useEffect(() => {
    fetchDoctorDates();
  }, []);

  const doctorId = sessionStorage.getItem('doctorId');
  const accessToken = sessionStorage.getItem('doctorAccessToken');
  const headers = {
    "Authorization": `Bearer ${accessToken}`
  };

  const fetchDoctorDates = async () => {
    try {
      const response = await axios.get(`http://localhost:7001/api/v1/appointments/doctors/${doctorId}/dates`, { headers });
      const dates = response.data.data.map(item => item.date);
      setMarked(dates);
      updateNextShift(dates);
    } catch (error) {
      console.error('Error fetching doctor dates:', error);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toLocaleDateString('en-CA');
      if (marked.includes(dateString)) {
        return 'highlight';
      }
    }
    return null;
  };

  const handleClick = (date) => {
    const clickedDate = date.toLocaleDateString('en-CA');
    setSelectedDate(clickedDate);
    setStartTime('');
    setEndTime('');

    if (marked.includes(clickedDate)) {
      setCancelShiftDate(true);
    } else {
      setShiftDate(true);
    }
  };

  const handleAdd = async () => {
    if (startTime && endTime) {
      try {
        await axios.post(`http://localhost:7001/api/v1/appointments/doctors/${doctorId}/availability`, {
          date: selectedDate,
          startTime,
          endTime
        }, { headers });
        fetchDoctorDates();
        setShiftDate(false);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.error('Error adding shift:', error);
        }
      }
    }
  };

  const handleCancel = async () => {
    try {
      await axios.delete(`http://localhost:7001/api/v1/appointments/doctors/${doctorId}/cancel-shift`, {
        headers,
        data: { date: selectedDate }
      });
      fetchDoctorDates();
      setCancelShiftDate(false);
    } catch (error) {
      console.error('Error cancelling shift:', error);
    }
  };

  const updateNextShift = (dates) => {
    const futureDates = dates.filter(date => new Date(date) > new Date());
    futureDates.sort((a, b) => new Date(a) - new Date(b));

    if (futureDates.length > 0) {
      const nextShiftDate = futureDates[0];
      setNextShift({ date: nextShiftDate });
    } else {
      setNextShift(null);
    }
  };

  return (
    <div className='w-1/3 h-4/5 bg-white rounded-lg flex items-center flex-col gap-12 relative'>
      <FaTimes id="shift" className="absolute top-4 right-4 text-gray-600 cursor-pointer"
              onClick={() => setShifts(false)}
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
