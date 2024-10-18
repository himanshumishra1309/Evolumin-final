import React, { useState, useEffect } from 'react';
import { FaPen, FaSave } from 'react-icons/fa';

/*
To make the form editable we had to do some specific things, those are:
1] setting up a state to know whether the form i editable or not
2] setting up a state which is basically a objects which contains the key and value which are suppoed to be in the form
3] we have to make sure that we store the value for every key in the local storange so while storing the values we use JSON.stringify() and while taking the values from the local storage we use JSON.parse()
4] we used a useEffect to take the saved form data everytime and save it into the savedformData variable and saved the values in the savedFormData to the setFormData fn which made changes in the initial values of the specific keys in the useState()
5] Then we had to make sure we handle the input chnages properly so we 
*/

const ReportForm = () => {
  const [isEditing, setIsEditing] = useState(false); //made to allow editing
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dateOfBirth: '',
    contactNumber: '',
    bloodGroup: '',
    medications: '',
    allergies: '',
    diseases: '',
  }); //made to set data in the form

  useEffect(() => {
    // Load saved form data from localStorage on initial render
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);


  {/*
  
    console.log(savedFormData):

    {name: 'Himanshu', age: '18', dateOfBirth: '123456789', contactNumber: '12345', bloodGroup: '', …}
    age:"18"
    allergies:"Nothing"
    bloodGroup:""
    contactNumber:"12345"
    dateOfBirth:"123456789"
    diseases:""
    medications:""
    name:"Himanshu"
    [[Prototype]]:Object
    
  */}


  {/*
  
    console log of e :
    
    SyntheticBaseEvent {_reactName: 'onChange', _targetInst: null, type: 'change', nativeEvent: InputEvent, target: input#dateOfBirth.w-full.py-1.px-2.text-2xl.border-b-2.border-black.focus:outline-none.focus:ring-0, …}

    bubbles: true
    cancelable: false
    currentTarget: null
    defaultPrevented: false
    eventPhase: 3
    isDefaultPrevented: ƒ functionThatReturnsFalse()
    isPropagationStopped: ƒ functionThatReturnsFalse()
    isTrusted: true
    nativeEvent:  InputEvent {isTrusted: true, data: '9', isComposing: false, inputType: 'insertText', dataTransfer: null, …}
    target: input#dateOfBirth.w-full.py-1.px-2.text-2xl.border-b-2.border-transparent.focus:outline-none.focus:ring-0
    timeStamp: 10792
    type: "change"
    _reactName: "onChange"
    _targetInst: null
    [[Prototype]]: Object

  */}

  {/*
  
    consosle.log of e.target:

    <input type="text" id="dateOfBirth" name="dateOfBirth" class="w-full py-1 px-2 text-2xl border-b-2 border-transparent focus:outline-none focus:ring-0" value="123456789" style="font-family: &quot;Kaisei HarunoUmi&quot;, sans-serif; color: rgb(0, 0, 0); background-color: transparent; border-bottom: 2px solid black;" readonly>

    this came when I selected edit and started writing things in date od birth.

  */}

  {/* 
   
    console.log of name: dateOfBirth
    console.log of value: 123456789

  */}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  {/* 

    const { name, value } = e.target : 
  
    
    Destructuring:
    --> This line extracts the name and value properties from the e.target object.
    --> e.target refers to the input element that triggered the event.
    --> name is the name attribute of the input field.
    --> value is the current value of the input field.

  */}

  {/*
  
    setFormData({
      ...formData,
      [name]: value,
    });

    this first copies the previous form data and updates the new data in the format [key]:value, that is [name]: value

  */}

  //setFormData: Updates the formData state by spreading the existing formData and changing the value of the field that triggered the event.

  const handleSave = () => {
    // Save the form data to localStorage
    localStorage.setItem('formData', JSON.stringify(formData));
    setIsEditing(false);
    alert('All changes have been saved.');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to capitalize the first letter of each word
  const capitalizeLabel = (label) => {
    return label
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div id="report">
      <h2 className='ml-6 mt-10 text-4xl font-bold text-teal-600 mb-4 underline' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>Your Report</h2>
      <div className='m-10'>
        <div className="w-full mx-auto p-6 bg-white border rounded-3xl shadow-md flex flex-col justify-start items-start">
          <form className='w-full'>
            {/* 
            
            Object.keys(formData): This method returns an array of the keys in the formData object. The keys are name, age, dateOfBirth, contactNumber, bloodGroup, medications, allergies, and diseases 
            
            .map((field, index) => (...)): This iterates over each key in the formData object. The field variable represents each key, and index is the index of the current key in the array.

            */}
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
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full py-1 px-2 text-2xl border-b-2 ${isEditing ? 'border-black' : 'border-transparent'} focus:outline-none focus:ring-0`}
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
          <div className="flex justify-center w-full mt-4">
            {isEditing ? (
              <button
                type="button"
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleSave}
              >
                <FaSave className="inline mr-2" /> Save
              </button>
            ) : (
              <button
                type="button"
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleEdit}
              >
                <FaPen className="inline mr-2" /> Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
