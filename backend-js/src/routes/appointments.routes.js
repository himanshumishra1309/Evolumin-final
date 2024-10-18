import express from 'express';
import { createAppointment, getDoctorAvailability, bookAppointment, getDoctorAppointments } from '../controllers/appointment.controller';
import { verifyStudentJWT } from '../middlewares/student.middleware';
import { verifyDoctorJWT } from '../middlewares/doctor.middleware';

const router = express.Router();

// Route to create availability for a doctor (doctor creates available slots)
router.post('/doctors/:doctorId/availability',verifyDoctorJWT, createAppointment);

// Route to get the availability of a doctor (students view available slots)
router.get('/doctors/:doctorId/availability',verifyStudentJWT, getDoctorAvailability);

// Route for a student to book an appointment with a doctor
router.post('/doctors/:doctorId/book',verifyStudentJWT, bookAppointment);

// Route for a doctor to view all their booked appointments
router.get('/doctors/:doctorId/appointments',verifyDoctorJWT, getDoctorAppointments);

export default router;