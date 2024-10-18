import React, {useState, useContext} from 'react'
import ViewProfile from '../ViewProfile/ViewProfile';
import DrPrescribe from '../DrPrescribe/DrPrescribe';
import { Context } from '../../../../Context/Context';

function Card({name, date, time, symptoms, index}) {
  const { visibleProfile, setVisibleProfile } = useContext(Context);
  const {prescribe, setPrescribe} = useContext(Context);
  const toggleProfile = () => {
    setVisibleProfile(true);
  };

  const togglePrescribe = () => {
    setPrescribe(true);
  };

  return (
    <div className="w-64 min-w-[16rem] rounded-3xl overflow-hidden border-1 shadow-xl p-4 m-4 bg-white" key={index}>
      <div className="mb-4">
        <p className="text-lg font-bold" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>Name-: {name}</p>
        <p className="text-lg" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>Date-: {date}</p>
        <p className="text-lg" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>Time-: {time}</p>
        <p className="text-lg" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}>Symptoms-: {symptoms}</p>
      </div>
      <div className="flex flex-col gap-3 justify-between">
        <button
          onClick={toggleProfile}
          className="bg-transparent text-teal-700 border border-teal-700 font-semibold rounded-full px-4 py-2 hover:bg-teal-700 hover:text-white"
          style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}
        >
          View Profile
        </button>
        <button
          onClick={togglePrescribe}
          className="bg-transparent text-teal-700 border border-teal-700 font-semibold rounded-full px-4 py-2 hover:bg-teal-700 hover:text-white"
          style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}
        >
          Prescribe
        </button>
      </div>
      
      {visibleProfile && (
        <div id="profile-overlay" className="mt-16 fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-10">
          <ViewProfile />
        </div>
      )}

      {prescribe && (
        <div id="prescribe-overlay" className="mt-16 fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-10">
          <DrPrescribe />
        </div>
      )}
    </div>
  )
}

export default Card
