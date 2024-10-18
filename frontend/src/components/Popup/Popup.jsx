import React from 'react';

const Popup = ({ isVisible, onClose, onContinue }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 200 }}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                <p className="text-xl mb-4 text-center">DO YOU WANT TO CALL AN AMBULANCE</p>
                <div className='flex gap-10'>
                    <button
                        onClick={onContinue}
                        className="w-full hover:bg-teal-500 bg-teal-700 text-white py-2 rounded-lg shadow hover:shadow-lg transition duration-300 mb-4"
                    >
                        Continue
                    </button>
                    <button
                        onClick={()=> {
                            console.log('Cancel button clicked');
                            onClose()}}
                        className="w-full hover:bg-red-500 bg-red-600 text-white py-2 rounded-lg shadow hover:shadow-lg transition duration-300 mb-4"
                    >
                        Cancel
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default Popup;
