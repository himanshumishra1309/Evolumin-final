import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaPassport, FaPen, FaSave } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import './loading.css'

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dob: '',
    roll_no: '',
    academic_year: '',
    hostel:'',
    room_no: '',
  });
  const [isLoading, setIsLoading] = useState(true); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };  
  
  // Fetch the profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get access token from sessionStorage
        const accessToken = sessionStorage.getItem('studentAccessToken');

        const headers = {
            "Authorization": `Bearer ${accessToken}`
        };
        const response = await axios.get('http://localhost:7001/api/v1/students/current-user', { headers });
        console.log('Fetched Profile:', response.data);
  
        // Update profile data state
        setProfileData({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          dob: formatDate(response.data.data.dob) || '', 
          roll_no: response.data.data.roll_no || '',
          academic_year: response.data.data.academic_year || '',
          hostel: response.data.data.hostel || '',
          room_no: response.data.data.room_no || '',
        });
  
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 404) {
          alert('Profile not found.');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  
  // Log profileData after it has been updated
  useEffect(() => {
    console.log("Profile Data State Updated:", profileData);
  }, [profileData]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    // Format the date to DD-MM-YYYY format before setting it in state
    if (date) {
      const formattedDate = formatDate(date);
      setProfileData({ ...profileData, dob: formattedDate });
    } else {
      setProfileData({ ...profileData, dob: '' });
    }
  };


// Function to update profile data
const handleSave = async () => {
  try {
    const accessToken = sessionStorage.getItem('studentAccessToken');
    // console.log({userInfo});
    const headers = {
      "Authorization": `Bearer ${accessToken}`
    }
    // Convert the dob back to ISO format before sending
    const [day, month, year] = profileData.dob.split('-');
    const dobISO = new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
    const response = await axios.patch('http://localhost:7001/api/v1/students/update-account', {
      name: profileData.name,
      email: profileData.email,
      dob: dobISO,
      roll_no: profileData.roll_no,
      academic_year: profileData.academic_year,
      room_no: profileData.room_no,
      hostel: profileData.hostel,   // Include this if it's required by your API
      _id: profileData._id          // If the API expects an ID
    }, { headers });
    if (response.status === 200) {
      alert('Profile updated successfully.');
      setIsEditing(false);

      // Re-fetch profile data after update
      const updatedResponse = await axios.get('http://localhost:7001/api/v1/students/current-user', { headers });
      const updatedData = updatedResponse.data;
      setProfileData({
        name: updatedData.data.name || '',
        email: updatedData.data.email || '',
        dob: formatDate(updatedData.data.dob) || '',
        roll_no: updatedData.data.roll_no || '',
        academic_year: updatedData.data.academic_year || '',
        hostel: updatedData.data.hostel || '',
        room_no: updatedData.data.room_no || '',
      });
    } else {
      alert('Failed to update profile. Please try again.');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.response && error.response.status === 422) {
      alert('Validation error: Please ensure all fields are filled out correctly.');
    } else {
      alert('Error occurred while updating the profile.');
    }
  }
};


  const handleEdit = () => {
    setIsEditing(true);
  };

  const capitalizeLabel = (label) => {
    return label
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-2/5 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="pt-3 pb-3">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M24 22.525c0 .81-.658 1.475-1.467 1.475H1.467C.658 24 0 23.334 0 22.525c0-.81.658-1.475 1.467-1.475h21.066c.81 0 1.467.665 1.467 1.475zM9.515 2.786a2.786 2.786 0 1 1 5.572 0 2.786 2.786 0 0 1-5.572 0zM15.49 6.943c-1.63 0-3.062.918-3.83 2.26-.768-1.342-2.2-2.26-3.83-2.26C4.57 6.943 3 8.536 3 10.448v2.695c0 .293.225.532.515.532h17.97c.29 0 .515-.239.515-.532V10.45c0-1.911-1.57-3.504-3.51-3.504z" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-7" style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
          {isEditing ? (
            <input
              type="text"
              value={profileData.name}
              name="name"
              onChange={handleInputChange}
              className="w-full py-1 px-2 text-lg border-b-2 border-black focus:outline-none focus:ring-0"
              style={{ color: '#000', backgroundColor: 'transparent', borderBottom: '2px solid black' }}
            />
          ) : (
            profileData.name
          )}
        </h2>
        <form className="w-full">
          {['email', 'roll_no', 'academic_year', 'hostel', 'room_no'].map((field, index) => (
            <div key={index} className="w-full mb-4 flex items-center justify-between">
              <label
                htmlFor={field}
                className="block text-start text-lg font-medium text-blue-800 w-1/3"
                style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}
              >
                {capitalizeLabel(field)}:
              </label>
              <div className="relative mt-1 flex items-center w-2/3">
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={profileData[field]}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={`w-full py-1 px-2 text-lg border-b-2 ${isEditing ? 'border-black' : 'border-transparent'} focus:outline-none focus:ring-0`}
                  style={{
                    fontFamily: 'Kaisei HarunoUmi, sans-serif',
                    color: '#000',
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid black',
                  }}
                />
              </div>
            </div>
          ))}
          <div className="w-full mb-4 flex items-center justify-between">
            <label
              htmlFor="dob"
              className="block text-start text-lg font-medium text-blue-800 w-1/3"
              style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}
            >
              Date of Birth:
            </label>
            <div className="relative mt-1 flex items-center w-2/3">
              <DatePicker
                selected={profileData.dob ? new Date(profileData.dob.split('-').reverse().join('-')) : null}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                className="w-full py-1 px-2 text-lg border-b-2 border-black focus:outline-none focus:ring-0"
                readOnly={!isEditing}
                placeholderText="Select Date"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              >
                <FaSave className="inline mr-1" />
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              >
                <FaPen className="inline mr-1" />
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to capitalize field labels
const capitalizeLabel = (label) => {
  return label.charAt(0).toUpperCase() + label.slice(1).replace('_', ' ');
};

export default ProfileCard;
