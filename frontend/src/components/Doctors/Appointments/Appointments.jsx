import React, { useState } from 'react';
import AData from './AData/AData.json';
import Card from './Card/Card';
import './scrollbar.css';

const Dates = [
  new Date(Date.UTC(2024, 6, 24)),
  new Date(Date.UTC(2024, 6, 25)),
];

function Appointments() {
  const [selectedDate, setSelectedDate] = useState("");

  
  // Function to handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Function to convert the date string from "DD-MM-YYYY" to "YYYY-MM-DD"
  const convertDateStringToISO = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  // Function to sort data by time
  const sortByTime = (data) => {
    return data.sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);

      if (timeA[0] < timeB[0]) return -1;
      if (timeA[0] > timeB[0]) return 1;
      if (timeA[1] < timeB[1]) return -1;
      if (timeA[1] > timeB[1]) return 1;
      return 0;
    });
  };

  // Filter and sort the AData based on the selected date
  const filteredData = selectedDate
    ? AData.filter(item => convertDateStringToISO(item.date) === selectedDate)
    : AData;

  const sortedData = sortByTime(filteredData);


  {/*
  
    date = new Date(Date.UTC(2024, 6, 24)),
    date.toISOString() --> '2024-07-24T00:00:00.000Z'
    date.toDateString() --> 'Wed Jul 24 2024'
    
  */}

  return (
    <div className='m-8'>
      <h1 className='m-6 mt-10 pt-6 text-4xl font-bold text-teal-600 mb-4 underline' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Appointments</h1>
      <div className='flex justify-end'>
        <p className='text-2xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>Filter: </p>
        <select className='w-auto border rounded-lg text-xl cursor-pointer' onChange={handleDateChange}>
          <option className='cursor-pointer' value="" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>All</option>
          {Dates.map((date, index) => (
            <option className='cursor-pointer' key={index} value={date.toISOString().split('T')[0]} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>
              {date.toDateString()}
            </option>
          ))}
        </select>
      </div>
      <div className='w-full h-1/2 overflow-x-auto flex gap-4 p-4 scrollbar-custom'>
        {sortedData.map((item, index) => (
          <Card 
            index={index}
            name={item.name}
            date={item.date}
            time={item.time}
            symptoms={item.symptoms}
          />
        ))}
      </div>
    </div>
  );
}

export default Appointments;
