import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Choice from './components/Choice/Choice'
import DoctorSISU from './components/DoctorSISU/DoctorSISU'
import StudentSISU from './components/StudentSISU/StudentSISU'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <DoctorSISU/>
    </>
  )
}

export default App
