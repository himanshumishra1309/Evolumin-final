import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Student } from "../models/student.model.js";
import { Doctor } from "../models/doctor.model.js";

// Helper function to verify student ID
const verifyStudentId = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID format.");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found.");
  }
  return student;
};

// Generalized function to fetch doctor data by speciality
const fetchDoctorData = async (studentId, speciality) => {
  await verifyStudentId(studentId);

  const doctors = await Doctor.find(
    { speciality },
    "_id name speciality qualification experience currently_working"
  );
  if (!doctors || doctors.length === 0) {
    throw new ApiError(404, `${speciality} doctors not found.`);
  }

  return doctors;
};

// Generalized fetch function handler
const fetchDoctorDataBySpeciality = (speciality) => asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    throw new ApiError(400, "Student ID is required.");
  }
  
  const doctors = await fetchDoctorData(studentId, speciality);
  res.json(new ApiResponse(200, `${speciality} data retrieved.`, doctors));
});

// Export specific handlers by passing specialities
export const fetchPCPdata = fetchDoctorDataBySpeciality("Primary Care Physician");
export const fetchDentistdata = fetchDoctorDataBySpeciality("Dentist");
export const fetchPsychologistdata = fetchDoctorDataBySpeciality("Psychologist");
export const fetchDermatologistdata = fetchDoctorDataBySpeciality("Dermatologist");
export const fetchAllergistdata = fetchDoctorDataBySpeciality("Allergist");
export const fetchPhysicalTherapistdata = fetchDoctorDataBySpeciality("Physical Therapist");