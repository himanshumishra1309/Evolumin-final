import express from 'express';
import { 
    sendAlert,
    viewAlerts,
    editAlert,
    deleteAlert 
} from '../controllers/alerts.controller.js';
import { verifyDoctorJWT } from '../middlewares/doctor.middleware.js';
import { verifyStudentJWT } from '../middlewares/student.middleware.js';

const router = express.Router();

// Route for a doctor to create a new alert
router.post('/doctors/:doctorId/alert', verifyDoctorJWT, sendAlert);

// Route for both doctors and students to view all alerts
router.get('/alerts', [verifyDoctorJWT, verifyStudentJWT], viewAlerts);

// Route for a doctor to edit their own alert
router.put('/alerts/:alertId', verifyDoctorJWT, editAlert);

// Route for a doctor to delete their own alert
router.delete('/alerts/:alertId', verifyDoctorJWT, deleteAlert);

export default router;