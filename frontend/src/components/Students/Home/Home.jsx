import React, { useRef } from 'react';
import Header from '../Header/Header';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorAdvice from '../DoctorAdvice/DoctorAdvice';
import Shop from '../Shop/Shop';
import ReportForm from '../ReportForm/ReportForm';
import Alerts from '../Alerts/Alerts';

function Home() {
  const appointmentRef = useRef(null);
  const adviceRef = useRef(null);
  const shopRef = useRef(null);
  const reportRef = useRef(null);
  const alertsRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });  };

  return (
    <>
      <Header
        scrollToAppointment={() => scrollToSection(appointmentRef)}
        scrollToAdvice={() => scrollToSection(adviceRef)}
        scrollToShop={() => scrollToSection(shopRef)}
        scrollToReport={() => scrollToSection(reportRef)}
        scrollToAlerts={() => scrollToSection(alertsRef)}
      />
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
