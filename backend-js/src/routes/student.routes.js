import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, fetchAllStudents} from "../controllers/student.controller.js";
import { verifyStudentJWT } from "../middlewares/student.middleware.js";
import { verifyDoctorJWT } from "../middlewares/doctor.middleware.js";

const router = Router();

router.route('/register').post(registerUser);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyStudentJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyStudentJWT, changeCurrentPassword)
router.route('/current-user').get(verifyStudentJWT, getCurrentUser)
router.route('/update-account').patch(verifyStudentJWT, updateAccountDetails) 
router.route('/all-students').get(verifyDoctorJWT, fetchAllStudents)

export default router;