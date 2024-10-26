import React, {useRef} from 'react'
import Appointments from '../Appointments/Appointments'
import Queries from '../Queries/Queries'
import DocHeader from '../DocHeader/DocHeader'
import MonthlyCheckup from '../MonthlyCheckup/MonthlyCheckup';

function Home2() {
  const appointmentsRef = useRef(null);
  const queriesRef = useRef(null);
  const checkupRef = useRef(null);

  const scrollToSection = (ref) =>{
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
        <DocHeader
          scrollToAppointments={() => scrollToSection(appointmentsRef)}
          scrollToQueries={() => scrollToSection(queriesRef)}
          scrollToCheckup={() => scrollToSection(checkupRef)}
        />
        <div id="appointments" ref={appointmentsRef}>
          <Appointments/>
        </div>
        <div id="queries" ref={queriesRef}>
          <Queries/>
        </div>
        <div id='checkup' ref={checkupRef}>
          <MonthlyCheckup/>
        </div>
    </>
  )
}

export default Home2
