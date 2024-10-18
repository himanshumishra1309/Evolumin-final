import React from 'react'
import { Outlet } from 'react-router-dom'
import Doc1 from './DABody/Doc1/Doc1'
import DAHeader from './DAHeader/DAHeader'

function DoctorAppointment() {
  return (
    <div id="appointment">
      <h1 className='m-6 text-4xl font-bold text-teal-600 mb-4 underline' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Dr. Appointment</h1>
      <div className='border rounded-3xl shadow-lg m-10'>
        <DAHeader/>
        <Outlet/>
      </div>
    </div>
  )
}

export default DoctorAppointment
