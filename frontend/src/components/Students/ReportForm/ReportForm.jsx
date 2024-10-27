import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ReportForm = ({ studentEmail }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    contactNumber: '',
    blood_group: '',
    medications: '',
    allergies: '',
    diseases: '',
  });
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const token = sessionStorage.getItem('studentAccessToken');
        const studentEmail = sessionStorage.getItem('studentEmail');
        const response = await axios.get(`http://localhost:7001/api/v1/reports/students/${studentEmail}/report`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token from session storage
          },
        });

        if (response.status === 200) {
          const reportData = response.data.data;
          setFormData({
            name: reportData.name || '',
            email: reportData.email || '',
            dob: reportData.dob || '',
            blood_group: reportData.blood_group || '',
            medications: reportData.medications || '',
            allergies: reportData.allergies || '',
            diseases: reportData.diseases || '',
          });
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

    fetchLatestReport();
  }, [studentEmail]);

  const capitalizeLabel = (label) => {
    return label
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <motion.div
      id="report"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-auto max-h-full"
    >
      <h2 className='ml-6 mt-4 text-3xl font-bold text-teal-600' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Your Report
      </h2>
      <div className='m-4'>
        <motion.div
          className="w-full mx-auto p-4 bg-white border rounded-3xl shadow-lg flex flex-col justify-start items-start"
          whileHover={{ boxShadow: "0px 0px 8px rgb(0,0,0,0.2)" }}
        >
          <form className='w-full'>
            {Object.keys(formData).map((field, index) => (
              <motion.div
                key={index}
                className="w-full mb-3 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <label 
                  htmlFor={field} 
                  className="block text-start text-lg font-medium text-blue-800 w-1/3" 
                  style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}
                >
                  {capitalizeLabel(field.replace('_', ' '))}:
                </label>
                <div className="relative mt-1 flex items-center w-2/3">
                  <motion.input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    readOnly={true}
                    className="w-full py-1 px-2 text-base rounded-md border border-gray-300 focus:outline-none"
                    style={{ 
                      fontFamily: 'Kaisei HarunoUmi, sans-serif', 
                      color: '#6B7280',
                      backgroundColor: '#F3F4F6',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </form>
        </motion.div>
      </div>
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <FaExclamationTriangle className="mr-2" />
            All changes have been saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportForm;
