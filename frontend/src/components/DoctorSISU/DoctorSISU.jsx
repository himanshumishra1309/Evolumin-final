import React, { useEffect, useState } from 'react';
import './doctorsisu.css';
import Popup from '../Popup/Popup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrackAmb from './TrackAmb/TrackAmb';

function DoctorSISU() {
  const navigate = useNavigate();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [trackAmb, setTrackAmb] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    qualification: '',
    experience: '',
    password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const main = document.getElementById('main');

    if (signUpButton && signInButton && main) {
      const signUpClick = () => main.classList.add("right-panel-active");
      const signInClick = () => main.classList.remove("right-panel-active");

      signUpButton.addEventListener('click', signUpClick);
      signInButton.addEventListener('click', signInClick);

      return () => {
        signUpButton.removeEventListener('click', signUpClick);
        signInButton.removeEventListener('click', signInClick);
      };
    }
  }, []);
  
  const handleCancleClick = () => {
    const changebutton = document.querySelector('#Ambulance-Button');
    changebutton.classList.remove('bg-orange-500');
    changebutton.classList.add('bg-red-600');
    changebutton.innerText = "Call an Ambulance"
    setTrackAmb(false);
  }

  const handleSavePostClick = (event) => {
    event.preventDefault();
    if(event.target.innerHTML == "Call an Ambulance"){
        setPopupVisible(true);
    }
    if(event.target.innerHTML == "Track Your Ambulance"){
        console.log(event.target.innerHTML);
        setPopupVisible(false);
        setTrackAmb(true);
    }
};

const handleContinue = (event) =>{
    setPopupVisible(false);
    const changebutton = document.querySelector('#Ambulance-Button')
    changebutton.classList.add('bg-orange-500');
    changebutton.innerText = "Track Your Ambulance"
}

  const handleSignupChange = (e) => {
    // console.log(e);
    // console.log(e.target);
    const { id, value } = e.target; //id and values are teo fields inside the object of event that is 'e', this way is named as destructuring, suppose if we are qriting anythng in the name then the part 'name' is in the id and the thing that we are writing is the value of that specific id
    setSignupData({ ...signupData, [id]: value });
  };

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/doctors/register', signupData);
      navigate('/doc');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
    }
  };
  

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
      const response = await axios.post('/api/v1/doctors/login', loginData);
      console.log("Login response:", response.data);  // Add this to see what you get
      navigate('/doc');  // Redirect to profile page
  } catch (error) {
      if (error.response) {
          console.error('Error during login:', error.response.data); // Capture error message from backend
      } else {
          console.error('Error during login:', error.message); // Capture other errors
      }
  }
};

  return (
    <div className='w-full h-full flex flex-col justify-center items-center bg-slate-50'>
      <div className='w-full flex justify-center items-center bg-slate-50'>
        <div className="container w-1/2" id="main">
          <div className="sign-up">
            <form onSubmit={handleSignUpSubmit}>
              <p className='mb-4'>Sign Up</p>
              <input className='border mb-2 p-2' id="name" type="text" placeholder="Name*" value={signupData.name} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="email" type="email" placeholder="Email*" value={signupData.email} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="qualification" type="text" placeholder="Qualification*" value={signupData.qualification} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="experience" type="text" placeholder="Experience*" value={signupData.experience} onChange={handleSignupChange} required />
              <input className='border mb-2 p-2' id="password" type="password" placeholder="Password*" value={signupData.password} onChange={handleSignupChange} required />
              <button className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-teal-500 text-white m-2 font-semibold hover:bg-teal-400">Sign Up</button>
            </form>
          </div>

          <div className="sign-in">
            <form onSubmit={handleLoginSubmit}>
              <p className='mb-4'>Sign In</p>
              <input className='border mb-2 p-2' type="email-login" id="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
              <input className='border mb-2 p-2' type="Password" id="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
              <button className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-teal-500 text-white m-2 font-semibold hover:bg-teal-400">Sign In</button>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-left">
                <h1 className='mb-5 text-3xl font-semibold'>Already have an account?</h1>
                <button className='pt-2 pb-2 pl-4 pr-4 w-2/4 font-semibold' id="signIn">Sign In</button>
              </div>

              <div className="overlay-right">
                <h1 className='mb-5 text-3xl font-semibold'>New User?</h1>
                <button className='pt-2 pb-2 pl-4 pr-4 w-2/4 font-semibold' id="signUp">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center mt-10'>
        <button onClick={handleSavePostClick} className='bg-red-600 pt-2 pb-2 pl-4 pr-4 rounded-3xl text-white text-2xl hover:bg-red-400' id="Ambulance-Button">Call an Ambulance</button>
      </div>
      <Popup
        isVisible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onContinue={handleContinue}
      />
      <TrackAmb
        isVisible={trackAmb}
        onClose={() => setTrackAmb(false)}
        onCancel = {handleCancleClick}
      />
    </div>
  );
}

export default DoctorSISU;
