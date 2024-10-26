import express from 'express';
import { 
    createAppointment, 
    fetchAllDates,  // Added this line
    getDoctorAvailability, 
    bookAppointment, 
    getDoctorAppointments,
    cancelShift
} from '../controllers/appointments.controller.js';
import { verifyStudentJWT } from '../middlewares/student.middleware.js';
import { verifyDoctorJWT } from '../middlewares/doctor.middleware.js';

const router = express.Router();

// Route to create availability for a doctor (doctor creates available slots)
router.post('/doctors/:doctorId/availability', verifyDoctorJWT, createAppointment);

// Route to fetch all dates and availability for a doctor to view it's schedule
router.get('/doctors/:doctorId/dates', verifyDoctorJWT, fetchAllDates); // Added route for fetchAllDates

// Route to get the availability of a doctor (students view available slots)
router.get('/doctors/:doctorId/availability', verifyStudentJWT, getDoctorAvailability);

// Route for a student to book an appointment with a doctor
router.post('/doctors/:doctorId/book', verifyStudentJWT, bookAppointment);

// Route for a doctor to view all their booked appointments
router.get('/doctors/:doctorId/appointments', verifyDoctorJWT, getDoctorAppointments);

router.delete('/doctors/:doctorId/cancel-shift', verifyDoctorJWT, cancelShift);

export default router;
