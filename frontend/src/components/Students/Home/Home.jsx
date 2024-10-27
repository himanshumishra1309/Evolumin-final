import React, { useState, useRef } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import Header from '../Header/Header';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorAdvice from '../DoctorAdvice/DoctorAdvice';
import Shop from '../Shop/Shop';
import ReportForm from '../ReportForm/ReportForm';
import Alerts from '../Alerts/Alerts';

function Home() {
  const [runTour, setRunTour] = useState(false);
  const appointmentRef = useRef(null);
  const adviceRef = useRef(null);
  const shopRef = useRef(null);
  const reportRef = useRef(null);
  const alertsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = [
    {
      target: '[data-tour="call-ambulance"]',
      content: 'Use this "Ambulance Assistance" button to call or track an ambulance in case of emergency.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="profile-access"]',
      content: 'Access your profile information here. You can view and manage your personal details.',
    },
    {
      target: '#doctor-appointment',
      content: 'Book medical appointments by selecting an available doctor in this section.',
    },
    {
      target: '#doctor-advice',
      content: 'Chat with doctors and obtain prescriptions through our Doctor Advice feature.',
    },
    {
      target: '#shop',
      content: 'Purchase medicines directly from our platform in the Shop section.',
    },
    {
      target: '#report-form',
      content: 'Access and view your recent medical reports in this section.',
    },
    {
      target: '#alert',
      content: 'Stay updated with notifications about health checkup camps, contagious diseases, and other important alerts.',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        styles={{
          options: {
            arrowColor: '#e3ffeb',
            backgroundColor: '#e3ffeb',
            overlayColor: 'rgba(79, 26, 0, 0.4)',
            primaryColor: '#000',
            textColor: '#004a14',
            width: 300,
            zIndex: 1000,
          }
        }}
        callback={handleJoyrideCallback}
      />
      <Header
        scrollToAppointment={() => scrollToSection(appointmentRef)}
        scrollToAdvice={() => scrollToSection(adviceRef)}
        scrollToShop={() => scrollToSection(shopRef)}
        scrollToReport={() => scrollToSection(reportRef)}
        scrollToAlerts={() => scrollToSection(alertsRef)}
      />
 <button
  onClick={() => setRunTour(true)}
  className="fixed bottom-4 right-4 z-50 px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
>
  Start Tour
</button>

      <div id="doctor-appointment" ref={appointmentRef} style={{ paddingTop: '10px' }}>
        <DoctorAppointment />
      </div>
      <div id="doctor-advice" ref={adviceRef} style={{ paddingTop: '40px' }}>
        <DoctorAdvice />
      </div>
      <div id="shop" ref={shopRef} style={{ paddingTop: '70px' }}>
        <Shop />
      </div>
      <div id="report-form" ref={reportRef} style={{ paddingTop: '40px' }}>
        <ReportForm />
      </div>
      <div id="alert" ref={alertsRef} style={{ paddingTop: '40px' }}>
        <Alerts />
      </div>
    </>
  );
}

export default Home;