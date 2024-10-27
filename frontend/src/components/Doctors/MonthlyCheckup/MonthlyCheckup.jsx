import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportForm from '../../Students/ReportForm/ReportForm';

const MonthlyCheckup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:7001/api/v1/students/all-students', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('doctorAccessToken')}`
          }
        });
        setStudents(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch students. Please try again later.');
        setLoading(false);
      }
    };

    fetchStudents();
    
  }, []);

  console.log(students);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleOpenPopup = (student) => {
    setSelectedStudent(student);
    setShowPopup(true);
  };
  const handleClosePopup = () => setShowPopup(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-8">Loading students...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="monthly-checkup border p-10">
      <input
        type="text"
        placeholder="Search by student name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input w-full mb-4 p-2 rounded-lg shadow"
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student, index) => (
          <div key={index} className="student-card p-4 rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold">{student.name}</h3>
            <p className="text-gray-600">Roll No: {student.roll_no}</p>
            <p className="text-gray-600">Year: {student.academic_year}</p>
            <button
              onClick={() => handleOpenPopup(student)}
              className="fill-details-button mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Fill Details
            </button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="popup-content p-6 bg-white rounded-lg shadow-xl relative">
            <button
              onClick={handleClosePopup}
              className="close-button absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <ReportForm student={selectedStudent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCheckup;