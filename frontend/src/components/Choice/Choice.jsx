import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

function Choice() {
    const navigate = useNavigate();

    const handleSubmit1 = (e) => {
        e.preventDefault();
        navigate('/doctor')
    }

    const handleSubmit2 = (e) => {
        e.preventDefault();
        navigate('/student')
    }

  return (
    <>
    <div className='flex w-full h-full justify-center items-center'>
      <div className="w-2/5 h-4/5 border container flex flex-col items-center justify-center shadow-2xl rounded-lg">
        <h1 className='text-4xl font-semibold text-gray-700'>Are you a Doctor or a Student?</h1>
        <div className="options flex justify-around mt-24 gap-10">
            <button onClick={handleSubmit1} className="option p-3 pl-7 pr-7 rounded-3xl shadow-lg text-white text-lg" style={{backgroundColor: "#2DB4CC"}}>Doctor</button>
            <button onClick={handleSubmit2} className="option p-3 pl-7 pr-7 rounded-3xl shadow-lg text-white text-lg" style={{backgroundColor: "#2DB4CC"}}>Student</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Choice
