import React, { useEffect, useState, useContext } from 'react';
import logo from '../../Students/Header/logo.jpeg';
import account from '../../../svgs/youracc.svg';
import appointment from '../../../svgs/appointments.svg'
import ambulance from '../../../svgs/ambulance.svg'
import DocProfileCard from '../DocProfileCard/DocProfileCard';
import queries from '../../../svgs/queries(header).svg'
import shift from '../../../svgs/yourshift.svg'
import DocShift from '../DocShift/DocShift';
import { Context } from '../../../Context/Context';
import { FaAmbulance } from 'react-icons/fa';
import Popup from '../../Popup/Popup';
import TrackAmb from '../../DoctorSISU/TrackAmb/TrackAmb';
import alerts from '../../../svgs/alerts.svg'
import ShowAndPutAlerts from '../ShowAndPutAlerts/ShowAndPutAlerts';
import checkUp from '../../../svgs/checkup.svg';

export default function DocHeader({
  scrollToAppointments,
  scrollToQueries,
  scrollToCheckup,
}) {
  const [activeSection, setActiveSection] = useState('');
  const [profileCard, setProfileCard] = useState(false);
  const [alertCard, setAlertCard] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const {shifts, setShifts} = useContext(Context);

  const toggleCard = () => {
    setProfileCard((prev) => !prev);
  };

  const toggleShift = () => {
    setShifts(true);
  };

  const handleClickOutside = (event) => {
    if (event.target.id === 'profile-overlay') {
      setProfileCard(false);
    }
  };

  const handleAmbulanceClick = (e) => {
    if (e.currentTarget.classList.contains('bg-red-500')) {
      setShowPopup(true);
    }
    if (e.currentTarget.classList.contains('bg-yellow-400')) {
      setShowPopup2(true);
    }
  };
  
  const handleCancelAmbulance = ()=>{
    setShowPopup2(false);
    alert("Your ambulance is canceled")
    const ambulanceButton = document.querySelector('#ambulance');
    ambulanceButton.classList.remove('bg-yellow-400');
    ambulanceButton.classList.add('bg-red-500');
  }

  const handleContinue = ()=>{
    setShowPopup(false);
    alert('Your ambulance is on the way, click on the ambulance symbol to track your ambulance');
    const ambulanceButton = document.querySelector('#ambulance');
    ambulanceButton.classList.remove('bg-red-500');
    ambulanceButton.classList.add('bg-yellow-400');
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['appointments', 'queries'];
      let currentSection = '';

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop) {
          currentSection = section;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (profileCard) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileCard]);

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6">
        <div className="flex flex-wrap justify-between items-center mx-auto w-full">
          <div className="flex items-center">
            <img src={logo} className="mr-2 h-12" alt="Logo of the website MEDICARE" />
          </div>
          <div className="flex justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex items-center mt-4 font-medium flex-row gap-12 lg:mt-0">
              <li>
                <button
                  className='border-none'
                  onClick={scrollToAppointments}
                >
                  <img src={appointment} className='size-24' alt="Appointments icon" />
                </button>
              </li>
              <li>
                <button
                  className='border-none'
                  onClick={scrollToQueries}
                >
                  <img src={queries} className='size-16' alt="Queries icon" />
                </button>
              </li>
              <li>
                <button
                  className='border-none'
                  onClick={scrollToCheckup}
                >
                  <img src={checkUp} className='size-20' alt="Queries icon" />
                </button>
              </li>
              <li>
                <button
                  className='border-none'
                  onClick={toggleShift}
                >
                  <img src={shift} className='size-24' alt="Shift schedule icon" />
                </button>
              </li>
              <li>
                <button
                  className='border-none'
                  onClick={() => setAlertCard(true)}  // Trigger the alert popup
                >
                  <img src={alerts} className='size-16' alt="Send Alerts icon" />
                  {alertCard && (
                    <div
                      id="alert-overlay"  // Ensure this is unique per modal
                      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
                      onClick={(e) => {
                        if (e.target.id === 'alert-overlay') setAlertCard(false);  // Close when overlay is clicked
                      }}
                    >
                      <div onClick={(e) => e.stopPropagation()}>  {/* Stop propagation to prevent overlay close */}
                        <ShowAndPutAlerts onClose={() => setAlertCard(false)} />
                      </div>
                    </div>
                  )}
                </button>
              </li>
              <li>
                <button
                  id='ambulance'
                  className='border-none w-auto rounded-full bg-red-500 p-4 flex items-center justify-center'
                  onClick={handleAmbulanceClick}
                >
                  <FaAmbulance className='size-8 invert' />
                </button>
              </li>
              <li className="relative">
                <img onClick={toggleCard} src={account} className="h-20 w-20 cursor-pointer" alt="User account" />
                {profileCard && (
                  <div id="profile-overlay" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <DocProfileCard />
                  </div>
                )}
              </li>
            </ul>
          </div>
          {shifts && (
            <div id="profile-overlay" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <DocShift />
            </div>
          )}
        </div>
        {showPopup && (
          <div id="profile-overlay" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <Popup
              isVisible={showPopup}
              onClose={() => setShowPopup(false)}
              onContinue= {handleContinue}
            />
          </div>
        )}
        {showPopup2 && (
          <div id="profile-overlay" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <TrackAmb
              isVisible={showPopup2}
              onClose={() => setShowPopup2(false)}
              onCancel={handleCancelAmbulance}
            />
          </div>
        )}
      </nav>
    </header>
  );
}
