import React, {useState, useContext} from 'react'
import { FaTimes } from 'react-icons/fa';
import { Context } from '../../../../Context/Context';

function ViewProfile() {
  const {visibleProfile, setVisibleProfile} = useContext(Context);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        dateOfBirth: '',
        contactNumber: '',
        bloodGroup: '',
        medications: '',
        allergies: '',
        diseases: '',
    });

    const capitalizeLabel = (label) => {
        return label
          .split(/(?=[A-Z])/)
          .join(' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
    };
    const closeProfile = () => {
       // Hide the profile
    };
  return (
    <div className="w-1/2 mx-auto p-6 bg-white border rounded-3xl shadow-md relative">
      <FaTimes className="absolute top-4 right-4 text-gray-600 cursor-pointer" 
              onClick={()=> setVisibleProfile(false)}
              alt="Close prescription modal"
      />
          <form className='w-full'>
            {Object.keys(formData).map((field, index) => (
              <div key={index} className="w-full mb-4 flex items-center justify-between">
                <label 
                  htmlFor={field} 
                  className="block text-start text-2xl underline font-medium text-blue-800 w-1/3" 
                  style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif'}}
                >
                  {capitalizeLabel(field)}:
                </label>
                <div className="relative mt-1 flex items-center w-2/3">
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    readOnly
                    className={`w-full py-1 px-2 text-2xl border-b-2 focus:outline-none focus:ring-0`}
                    style={{ 
                      fontFamily: 'Kaisei HarunoUmi, sans-serif', 
                      color: '#000', 
                      backgroundColor: 'transparent', 
                      borderBottom: '2px solid black' 
                    }}
                  />
                </div>
              </div>
            ))}
          </form>
        </div>
  )
}

export default ViewProfile
