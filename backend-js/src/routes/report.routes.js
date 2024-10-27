import express from 'express';
import { 
    addReport, 
    getAllReports,
    getAllPastReports,
    editLatestReport,
    getLatestReport,
    getLatestReportByDoctor
} from '../controllers/report.controller.js';
import { verifyDoctorJWT } from '../middlewares/doctor.middleware.js';
import { verifyStudentJWT } from '../middlewares/student.middleware.js';

const router = express.Router();

// Route for a doctor to create a new report
router.post('/doctors/:doctorId/:email/report', verifyDoctorJWT, addReport);

// Route for a doctor to view all reports of a student
router.get('/students/:studentEmail/reports', verifyDoctorJWT, getAllReports);

// Route for a doctor to edit the latest report of a student
router.patch('/students/:studentEmail/report', verifyDoctorJWT, editLatestReport);

//router for student to view their latest report
router.get('/students/:email/report', verifyStudentJWT, getLatestReport);

router.get('/doctors/students/:studentEmail/latest-report', verifyDoctorJWT, getLatestReportByDoctor);

//route for students to view all the reports
router.get('/students/:studentEmail/reports', verifyStudentJWT, getAllPastReports);

export default router;  