import React, { useState, useEffect } from 'react';
import { FaPen, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ReportForm = ({ student }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    dob: student?.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
    blood_group: '',
    medications: '',
    allergies: '',
    diseases: '',
  });
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (student) {
      fetchLatestReport();
    }
  }, [student]);

  const fetchLatestReport = async () => {
    try {
      const doctorId = sessionStorage.getItem('doctorId');
      const response = await axios.get(
        `http://localhost:7001/api/v1/reports/doctors/students/${student.email}/latest-report`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('doctorAccessToken')}`,
          },
        }
      );
      if (response.data.data) {
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          dob: new Date(response.data.data.dob).toISOString().split('T')[0],
          blood_group: response.data.data.blood_group,
          medications: response.data.data.medications,
          allergies: response.data.data.allergies,
          diseases: response.data.data.diseases,
        });
      }
    } catch (error) {
      console.error("Error fetching latest report:", error);
      setError("Failed to fetch the latest report. Please try again.");
      // If no report exists, we'll use the student data we already have
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const doctorId = sessionStorage.getItem('doctorId');
      const response = await axios.post(
        `http://localhost:7001/api/v1/reports/doctors/${doctorId}/${formData.email}/report`,
        {
          ...formData,
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('doctorAccessToken')}`,
          },
        }
      );
      setIsEditing(false);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    } catch (error) {
      console.error("Error saving report:", error);
      setError("Failed to save the report. Please try again.");
    }
  };

  const handleEdit = () => setIsEditing(true);

  const capitalizeLabel = (label) => {
    return label
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <div className="text-center mt-8">Loading latest report...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      id="report"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-auto max-h-full"
    >
      <h2 className='ml-6 mt-4 text-3xl font-bold text-teal-600' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Student Report
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
                  {capitalizeLabel(field)}:
                </label>
                <div className="relative mt-1 flex items-center w-2/3">
                  <motion.input
                    type={field === 'dob' ? 'date' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    readOnly={!isEditing && ['name', 'email', 'dob'].includes(field)}
                    className={`w-full py-1 px-2 text-base rounded-md transition-all duration-300 ease-in-out ${
                      isEditing && !['name', 'email', 'dob'].includes(field)
                        ? 'border-2 border-blue-500 shadow-sm'
                        : 'border border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    style={{ 
                      fontFamily: 'Kaisei HarunoUmi, sans-serif', 
                      color: isEditing ? '#000' : '#6B7280',
                      backgroundColor: isEditing && !['name', 'email', 'dob'].includes(field) ? 'white' : '#F3F4F6',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </form>
          <motion.div 
            className="flex justify-center w-full mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence>
              {isEditing ? (
                <motion.button
                  key="save"
                  type="button"
                  className="py-2 px-4 bg-green-600 text-white text-base rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md"
                  onClick={handleSave}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaSave className="inline mr-2" /> Save Changes
                </motion.button>
              ) : (
                <motion.button
                  key="edit"
                  type="button"
                  className="py-2 px-4 bg-blue-600 text-white text-base rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
                  onClick={handleEdit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaPen className="inline mr-2" /> Edit Report
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
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