import React, { useContext, useEffect } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import { Context } from "../../../../Context/Context";

function ViewPrescription({ onBack }) {
  const { suggestedPills } = useContext(Context);

  useEffect(() => {
    console.log(suggestedPills);
  }, [suggestedPills]);

  return (
    <div className='w-full h-full bg-white'>
      <FaArrowLeft className='cursor-pointer' onClick={onBack} alt="Go Back"/>
      <div className='mt-4 flex flex-col gap-5'>
        {suggestedPills.map((med, index) => (
          <div key={index} className='bg-slate-200 p-6 rounded-lg shadow'>
            <h1 className='text-3xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              {index + 1}] Medicine Name: <span className='font-semibold'>{med.medicineName}</span>
            </h1>
            <p className='text-xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              <b>Quantity:</b> {med.medicineQuantity}
            </p>
            <div className='text-xl' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              <b>Timing:</b>
              {med.timings.map((timing, timingIndex) => (
                <p key={timingIndex} className='ml-4'>
                  {timing.beforeAfter} {timing.meal}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewPrescription;
