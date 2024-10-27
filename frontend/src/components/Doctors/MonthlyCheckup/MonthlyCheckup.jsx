import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ReportForm from '../../Students/ReportForm/ReportForm';

const MonthlyCheckup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleOpenPopup = (student) => {
    setSelectedStudent(student);
    setShowPopup(true);
  };
  const handleClosePopup = () => setShowPopup(false);

  const students = [
    { name: 'John Doe', rollNo: 'CSE001', year: '2nd' },
    { name: 'Jane Smith', rollNo: 'ECE045', year: '3rd' },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="monthly-checkup bg-white rounded-lg shadow-lg p-8"
    >
      <h1 className='text-4xl font-bold text-teal-600 mb-8' style={{ fontFamily: 'Kaisei HarunoUmi, sans-serif' }}>
        Monthly Checkup
      </h1>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by student name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <motion.div 
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredStudents.map((student, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="student-card p-6 h-40 rounded-lg shadow-md bg-white border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
            <p className="text-gray-600 mb-1">Roll No: {student.rollNo}</p>
            <p className="text-gray-600 mb-4">Year: {student.year}</p>
            <button
              onClick={() => handleOpenPopup(student)}
              className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Fill Details
            </button>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl relative h-[90%] overflow-y-auto"
            >
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <ReportForm student={selectedStudent} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MonthlyCheckup;
