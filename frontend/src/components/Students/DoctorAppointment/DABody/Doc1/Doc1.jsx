import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import doctorImage from '../../Images/doc1.jpg'; // Ensure the doctor image path is correct
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

function Doc1() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // console.log(date.getDate()); ---> 23 (the date we clicked on the callender)
    // console.log(date.getMonth()); ---> 6
    // console.log(date.getFullYear()); ---> 2024
    // console.log(date); ---> Thu Jul 11 2024 00:00:00 GMT+0530 (India Standard Time)
    // console.log(utcDate); ---> Thu Jul 11 2024 05:30:00 GMT+0530 (India Standard Time)
    // console.log(utcDate.toDateString()); ---> Thu Jul 11 2024
    // console.log(date.getFullYear(), date.getMonth(), date.getDate()); ---> 2024 6 11
    // console.log(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); ---> 1720656000000
    // Date.UTC(2024, 6, 5) ---> 1720137600000
    // new Date(Date.UTC(2024, 6, 5)) ---> Fri Jul 05 2024 05:30:00 GMT+0530 (India Standard Time)
    // new Date(Date.UTC(2024, 6, 5)).toDateString() ---> 'Fri Jul 05 2024'
    if (availableDates.some((availableDate) => availableDate.toDateString() === utcDate.toDateString())) {
      setSelectedDate(utcDate);
    } else {
      alert('Doctor is not available on this date');
    }
  };

  const handleDateSelect = (event) => {
    // console.log(event.target.value); ---> 2024-07-11
    const date = new Date(event.target.value);
    // date ---> Thu Jan 01 1970 05:30:02 GMT+0530 (India Standard Time)
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedDate(utcDate);
  };

  const handleTimeSelect = (event) => {
    setSelectedTime(event.target.value);
  };

  const tileClassName = ({ date, view }) => {
    // console.log({ date, view });
    {/*
    
      1] when the view is of normal calender that is when we can view the month of july this is the object that we get:
      
          {date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time), view: 'month'}
          date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time) {}
          view:"month"
          [[Prototype]]: Object

      2] when the view is of all the months in the calender that is when we click on the month's name we get to see the current year in that place and all the months appear there instead of date, then the value will be:
      
          {date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time), view: 'year'}
          date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time) {}
          view:"year"
          [[Prototype]]: Object

      3] when the view is of 10 years in the calender that is when we click on the year we get to see 2021-2030 in that place and all the years between them appears there instead of date, then the value will be:
      
          {date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time), view: 'decade'}
          date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time) {}
          view:"decade"
          [[Prototype]]: Object

      4] when the view is of 10 years sets in the calender that is when we click on the year we get to see 2001-2100 in that place and all the years between them appears there instead of date, then the value will be:
      
          {date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time), view: 'century'}
          date: Fri Nov 01 2024 00:00:00 GMT+0530 (India Standard Time) {}
          view:"century"
          [[Prototype]]: Object

    */}
    if (view === 'month') {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      if (availableDates.some((availableDate) => availableDate.toDateString() === utcDate.toDateString())) {
        return 'text-black font-bold text-2xl';
      }
      return 'text-gray-300';
    }
    return null;
  };

  return (
    <div>
      <div className='p-10'>
        <div className='flex gap-20 items-center justify-center'>
          <div className='flex flex-col items-center'>
            <img src={doctorImage} className='size-80 rounded-2xl'/>
            <p>M.B.B.S in PCP</p>
            <p>(AIIMS Delhi)</p>
          </div>
          <div className="flex flex-col items-start mb-5">
            <h1 className='text-4xl flex items-baseline text-teal-800 mb-3' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Dr. Mahesh Joshi<p className='text-lg text-teal-600' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>(IRIS HOSPITAL)</p></h1>
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

            {/*
            
              1] date.toISOString() ---> '2024-07-24T00:00:00.000Z'

              2] date.toISOString().split('T'):
                (2) ['2024-07-24', '00:00:00.000Z']
                0: "2024-07-24"
                1: "00:00:00.000Z"
                length: 2
                [[Prototype]]: Array(0)
                
              3] date.toISOString().split('T')[0]:
                "2024-07-24"

              4] {date.toDateString()}:
                  day month date year(this is the format)

            */}

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
              className={`rounded-2xl font-bold`}
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

export default Doc1
