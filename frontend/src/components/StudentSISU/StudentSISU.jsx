import React, { useEffect, useState } from 'react';
import '../DoctorSISU/doctorsisu.css';
import Popup from '../Popup/Popup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrackAmb from '../DoctorSISU/TrackAmb/TrackAmb';

function StudentSISU() {
    const navigate = useNavigate();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [trackAmb, setTrackAmb] = useState(false);
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        dob: '',
        roll_no: '',
        academic_year: '',
        branch: '',
        hostel: '',
        room_no: '',
        contact_no: '',
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

    const handleSavePostClick = (event) => {
        event.preventDefault();
        setPopupVisible(true);
    };

    const handleContinue = (event) =>{
        setPopupVisible(false);
        const changebutton = document.querySelector('#Ambulance-Button')
        changebutton.style.backgroundColor = "Orange";
        changebutton.innerText = "Track Your Ambulance"
    }

    const handleSignUpChange = (e) => {
        const { id, value } = e.target;
        setSignupData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };
    

    const handleLogInChange = (e) =>{
        const { id, value } = e.target; 
        setLoginData({ ...loginData, [id]: value });
    }

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7001/api/v1/students/register', signupData);
            console.log('Signup Response:', response);
            const accessToken = response?.data?.data?.accessToken;
            const studentId = response?.data?.data?.user?._id;
            const studentEmail = response?.data?.data?.user?.email;
            
            // Store user-specific data in sessionStorage
            sessionStorage.setItem('studentAccessToken', accessToken);
            sessionStorage.setItem('studentId', studentId);
            sessionStorage.setItem('studentEmail', studentEmail);
            navigate('/app/pcp');
        } catch (error) {
            alert('Error during signup:', error);
        }
    };
    

    const handleLoginSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7001/api/v1/students/login', loginData);
            console.log(response);
            const accessToken = response?.data?.data?.accessToken;
            const studentId = response?.data?.data?.user?._id;
            const studentEmail = response?.data?.data?.user?.email;
    
            // Store user-specific data in sessionStorage
            sessionStorage.setItem('studentAccessToken', accessToken);
            sessionStorage.setItem('studentId', studentId);
            sessionStorage.setItem('studentEmail', studentEmail);
            navigate('/app/pcp');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    }
    
    const handleCancleClick = () => {
        const changebutton = document.querySelector('#Ambulance-Button');
        changebutton.classList.remove('bg-orange-500');
        changebutton.classList.add('bg-red-600');
        changebutton.innerText = "Call an Ambulance"
        setTrackAmb(false);
    }

    return (

        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className='w-full flex justify-center items-center'>
                <div className="container w-1/2" id="main">
                    <div className="sign-up overflow-y-scroll pt-10">
                    <form onSubmit={handleSignUpSubmit}>
                            <p className='mb-4'>Register</p>
                            <input className='border mb-2 p-2' id="name" type="text" placeholder="Name*" required value={signupData.name} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="email" type="email" placeholder="Email*" required value={signupData.email} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="dob" type="date" placeholder="Date of Birth*" required value={signupData.dob} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="roll_no" type="text" placeholder="Roll No*" required value={signupData.roll_no} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="academic_year" type="text" placeholder="Academic Year*" required value={signupData.academic_year} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="branch" type="text" placeholder="Branch*" required value={signupData.branch} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="hostel" type="text" placeholder="Hostel*" required value={signupData.hostel} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="room_no" type="text" placeholder="Room Number*" required value={signupData.room_no} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="contact_no" type="text" placeholder="Contact Number*" required value={signupData.contact_no} onChange={handleSignUpChange} />
                            <input className='border mb-2 p-2' id="password" type="password" placeholder="Password*" required value={signupData.password} onChange={handleSignUpChange} />
                            <button className="button pt-2 pb-2 pl-4 pr-4 w-2/4 bg-teal-500 text-white m-2 font-semibold hover:bg-teal-400">Sign Up</button>
                        </form>
                    </div>

                    <div className="sign-in">
                        <form onSubmit={handleLoginSubmit}>
                            <p className='mb-4'>Sign In</p>
                            <input className='border mb-2 p-2' type="email" name="text" placeholder="Email" required id="email" value={loginData.email} onChange={handleLogInChange}/>
                            <input className='border mb-2 p-2' type="Password" name="text" placeholder="Password" required id="password" value={loginData.password} onChange={handleLogInChange}/>
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

export default StudentSISU;
