import React, { useRef, useState } from 'react'
import Joyride, { STATUS } from 'react-joyride'
import { motion } from 'framer-motion'
import Appointments from '../Appointments/Appointments'
import Queries from '../Queries/Queries'
import DocHeader from '../DocHeader/DocHeader'
import MonthlyCheckup from '../MonthlyCheckup/MonthlyCheckup'

function Home2() {
  const [runTour, setRunTour] = useState(false)
  const appointmentsRef = useRef(null)
  const queriesRef = useRef(null)
  const checkupRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' })
  }

  const steps = [
    {
      target: 'body',
      content: 'Welcome to the Doctor\'s Dashboard! Let\'s take a quick tour of the main features.',
      placement: 'center',
    },
    {
      target: '#appointments',
      content: 'This is the Appointments section. Here you can view and manage all the booked appointments with students, including their details.',
    },
    {
      target: '#queries',
      content: 'The Queries section allows you to chat with students and view the prescriptions you\'ve provided.',
    },
    {
      target: '#checkup',
      content: 'In the Monthly Checkup section, you can see and manage the scheduled monthly checkups with students.',
    },
  ]

  const handleJoyrideCallback = (data) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            primaryColor: '#00a86b',
            overlayColor: 'rgba(0, 128, 128, 0.1)',

            textColor: '#004a14',
            width: 300,
            zIndex: 1000,
          }
        }}
        callback={handleJoyrideCallback}
      />
      <DocHeader
        scrollToAppointments={() => scrollToSection(appointmentsRef)}
        scrollToQueries={() => scrollToSection(queriesRef)}
        scrollToCheckup={() => scrollToSection(checkupRef)}
      />
  <button
  onClick={() => setRunTour(true)}
  className="fixed bottom-4 right-4 z-50 px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
>
  Start Tour
</button>
      <div id="appointments" ref={appointmentsRef} className="mb-8">
        <Appointments/>
      </div>
      <div id="queries" ref={queriesRef} className="mb-8">
        <Queries/>
      </div>
      <div id='checkup' ref={checkupRef} className="mb-8">
        <MonthlyCheckup/>
      </div>
    </motion.div>
  )
}

export default Home2