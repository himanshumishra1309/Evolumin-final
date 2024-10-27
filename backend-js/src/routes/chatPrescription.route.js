import express from 'express';
import { addPrescriptions, getDoctorPrescriptions, getStudentPrescriptions } from '../controllers/chatPrescription.controller.js';
import { verifyDoctorJWT } from '../middlewares/doctor.middleware.js';
import { verifyStudentJWT } from '../middlewares/student.middleware.js';

const router = express.Router();

// Route for doctor to add prescriptions
router.post('/doctors/:doctorId/prescriptions', verifyDoctorJWT, addPrescriptions);

// Route for doctor to view their prescriptions
router.get('/doctors/:doctorId/prescriptions', verifyDoctorJWT, getDoctorPrescriptions);

// Route for student to view their prescriptions
router.get('/students/:studentId/prescriptions', verifyStudentJWT, getStudentPrescriptions);

export default router;