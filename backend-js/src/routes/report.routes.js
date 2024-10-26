import express from 'express';
import { 
    createReport, 
    viewReports,
    viewReport,
    editReport,
    deleteReport 
} from '../controllers/report.controller.js';
import { verifyDoctorJWT } from '../middlewares/doctor.middleware.js';
import { verifyStudentJWT } from '../middlewares/student.middleware.js';

const router = express.Router();

// Route for a doctor to create a new report
router.post('/doctors/:doctorId/report', verifyDoctorJWT, createReport);

// Route for a doctor to view all reports of a student
router.get('/students/:studentEmail/reports', verifyDoctorJWT, viewReports);

// Route for a doctor to edit the latest report of a student
router.patch('/students/:studentEmail/report', verifyDoctorJWT, editReport);

//router for student to view their latest report
router.get('/students/:studentEmail/report', verifyStudentJWT, viewReport);

//route for students to view all the reports
router.get('/students/:studentEmail/reports', verifyStudentJWT, viewReports);