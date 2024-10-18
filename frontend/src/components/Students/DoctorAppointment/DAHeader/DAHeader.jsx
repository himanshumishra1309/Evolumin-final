import React from 'react'
import { NavLink } from 'react-router-dom'

function DAHeader() {
  return (
    <header className='w-full flex h-10 mt-5'>
      <nav className='w-full flex h-10'>  
        <ul className='w-full flex h-10 justify-around'>
          <li>
            <NavLink to="/app/pcp" className={({ isActive }) =>`text-lg font-semibold ${isActive ? "underline" : ""}`} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              Primary Care Physician
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/dentist" className={({ isActive }) =>`text-lg font-semibold ${isActive ? "underline" : ""}`} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              Dentist
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/psychologist" className={({ isActive }) =>`text-lg font-semibold ${isActive ? "underline" : ""}`} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              Psychologist
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/dermatologist" className={({ isActive }) =>`text-lg font-semibold ${isActive ? "underline" : ""}`} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              Dermatologist
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/allergist" className={({ isActive }) =>`text-lg font-semibold ${isActive ? "underline" : ""}`} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              Allergist
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/physical-therapist" className={({ isActive }) =>`text-lg font-semibold ${isActive ? "underline" : ""}`} style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
              Physical Therapist
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default DAHeader
