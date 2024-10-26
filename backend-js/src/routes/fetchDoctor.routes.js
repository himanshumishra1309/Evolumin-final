import express from 'express';
import {
  fetchPCPdata,
  fetchDentistdata,
  fetchPsychologistdata,
  fetchDermatologistdata,
  fetchAllergistdata,
  fetchPhysicalTherapistdata,
} from '../controllers/fetchDoctor.controller.js';
import { verifyStudentJWT } from '../middlewares/student.middleware.js';

const router = express.Router();

// Apply verifyStudentJWT middleware to all routes
router.use(verifyStudentJWT);

// Route to fetch Primary Care Physician data
router.get('/primary-care-physician/:studentId', fetchPCPdata);

// Route to fetch Dentist data
router.get('/dentist/:studentId', fetchDentistdata);

// Route to fetch Psychologist data
router.get('/psychologist/:studentId', fetchPsychologistdata);

// Route to fetch Dermatologist data
router.get('/dermatologist/:studentId', fetchDentistdata);

// Route to fetch Allergist data
router.get('/allergist/:studentId', fetchAllergistdata);

// Route to fetch Physical Therapist data
router.get('/physical-therapist/:studentId', fetchPhysicalTherapistdata);

export default router;