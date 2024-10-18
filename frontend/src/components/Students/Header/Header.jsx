import React, { useEffect, useState } from 'react';
import logo from './logo.jpeg'; // Ensure the logo path is correct
import account from '../../../svgs/youracc.svg';
import ProfileCard from '../ProfileCard/ProfileCard';
import Popup from '../../Popup/Popup';
import TrackAmb from '../../DoctorSISU/TrackAmb/TrackAmb';
import { FaAmbulance } from 'react-icons/fa';

export default function Header({
  scrollToAppointment,
  scrollToAdvice,
  scrollToShop,
  scrollToReport,
  scrollToAlerts
}) {
  const [activeSection, setActiveSection] = useState('');
  const [profileCard, setProfileCard] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [buttonText, setButtonText] = useState('Call');


  const toggleCard = () => {
    setProfileCard((prev) => !prev);
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
    setButtonText('Call');
  }

  const handleContinue = ()=>{
    setShowPopup(false);
    alert('Your ambulance is on the way, click on the ambulance symbol to track your ambulance');
    const ambulanceButton = document.querySelector('#ambulance');
    ambulanceButton.classList.remove('bg-red-500');
    ambulanceButton.classList.add('bg-yellow-400');
    setButtonText('Track');
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['doctor-appointment', 'doctor-advice', 'shop', 'report-form'];
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
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto w-full">
          <div className="flex items-center">
            <img src={logo} className="mr-2 h-12" alt="Logo" />
          </div>
          <div className="flex justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex items-center flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <button
                  onClick={scrollToAppointment}
                  className={`advice font-semibold block py-2 px-4 rounded-full duration-200 ${
                    activeSection === 'doctor-appointment' ? 'bg-teal-700' : 'bg-teal-500'
                  } text-white hover:bg-teal-700 cursor-pointer`}
                >
                  Dr. Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToAdvice}
                  className={`advice font-semibold block py-2 px-4 rounded-full duration-200 ${
                    activeSection === 'doctor-advice' ? 'bg-teal-700' : 'bg-teal-500'
                  } text-white hover:bg-teal-700 cursor-pointer`}
                >
                  Dr. Advice
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToShop}
                  className={`advice font-semibold block py-2 px-4 rounded-full duration-200 ${
                    activeSection === 'shop' ? 'bg-teal-700' : 'bg-teal-500'
                  } text-white hover:bg-teal-700 cursor-pointer`}
                >
                  Shop Medicine
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToReport}
                  className={`advice font-semibold block py-2 px-4 rounded-full duration-200 ${
                    activeSection === 'report-form' ? 'bg-teal-700' : 'bg-teal-500'
                  } text-white hover:bg-teal-700 cursor-pointer`}
                >
                  Your Report
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToAlerts}
                  className={`advice font-semibold block py-2 px-4 rounded-full duration-200 ${
                    activeSection === 'shop' ? 'bg-teal-700' : 'bg-teal-500'
                  } text-white hover:bg-teal-700 cursor-pointer`}
                >
                  Alerts
                </button>
              </li>
              <li>
                <button
                  id='ambulance'
                  onClick={handleAmbulanceClick}
                  className='bg-red-500 w-auto p-2 text-white flex items-center justify-center gap-5 text-xl'
                >
                  {buttonText } <FaAmbulance className='size-7'/>
                </button>
              </li>
              <li className="relative">
                <img onClick={toggleCard} src={account} className="h-16 w-16 cursor-pointer" alt="Account" />
                {profileCard && (
                  <div id="profile-overlay" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <ProfileCard />
                  </div>
                )}
              </li>
            </ul>
          </div>
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
