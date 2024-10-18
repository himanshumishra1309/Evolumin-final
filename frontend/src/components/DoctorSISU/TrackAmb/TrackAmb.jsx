import React from 'react';
import { FaTimes } from 'react-icons/fa';

function TrackAmb({ isVisible, onClose, onCancel }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 200 }}>
      <div className="relative w-1/3 h-3/4 overflow-hidden bg-white rounded-lg p-3">
        {/* Close Icon */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-black hover:text-gray-400"
        >
          <FaTimes size={24} />
        </button>
        
        {/* Image */}
        <img 
          src="https://play-lh.googleusercontent.com/1Pwt77u1I1436DGIM2o_wPCRhNpegy14ey222wro9RlOX-5ZH3E7FThRsqZ5Aq_qaadh=w526-h296-rw" 
          alt="tracking-map" 
          className="object-cover object-[center_85%] w-full h-full"
        />
        <button 
          onClick={onCancel} 
          className="absolute bottom-10 left-40 p-3 bg-red-500 font-bold text-xl text-black hover:bg-red-400"
        >
          Cancel Ambulance
        </button>
      </div>
    </div>
  );
}

export default TrackAmb;
