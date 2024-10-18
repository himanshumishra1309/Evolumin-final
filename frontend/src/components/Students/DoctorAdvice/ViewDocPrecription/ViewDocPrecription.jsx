import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

function ViewDocPrecription({ onBack, prescriptionData }) {
    const [suggestedPills, setSuggestedPills] = useState([]);

    useEffect(() => {
        // If prescriptionData is available, set it to state
        if (prescriptionData) {
            setSuggestedPills(prescriptionData);
            // Optionally store the prescription data in localStorage
            localStorage.setItem('doctors-prescription', JSON.stringify(prescriptionData));
        } else {
            // Retrieve the stored pills data from localStorage if no props data
            const storedPills = JSON.parse(localStorage.getItem('doctors-prescription'));
            if (storedPills) {
                setSuggestedPills(storedPills);
            }
        }
    }, [prescriptionData]);

    return (
        <div className='w-full h-full bg-white'>
          <FaArrowLeft className='cursor-pointer' onClick={onBack} />
          <div className='mt-4 flex flex-col gap-5'>
            {suggestedPills.length > 0 ? (
              suggestedPills.map((pill, index) => (
                <div key={index} className='bg-slate-200 p-6 rounded-lg shadow'>
                  <h1 className='text-3xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
                    {index + 1}] Medicine Name: <span className='font-semibold' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>{pill.medicineName}</span>
                  </h1>
                  <p className='text-xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
                    <b>Quantity: {pill.medicineQuantity}</b>
                  </p>
                  <div className='text-xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
                    <b>Timing:</b>
                    {pill.timings.map((timing, timingIndex) => (
                      <p key={timingIndex} className='ml-4'>
                        {timing.beforeAfter} {timing.meal}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className='text-xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>No prescription data available</p>
            )}
          </div>
        </div>
    );
}

export default ViewDocPrecription;
