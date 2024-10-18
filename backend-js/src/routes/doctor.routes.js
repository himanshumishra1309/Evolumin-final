import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails} from "../controllers/doctor.controller.js";
import { verifyDoctorJWT } from "../middlewares/doctor.middleware.js";

const router = Router();

router.route('/register').post(registerUser);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyDoctorJWT, logoutUser)

router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyDoctorJWT, changeCurrentPassword)
router.route('/current-user').get(verifyDoctorJWT, getCurrentUser)
router.route('/update-account').patch(verifyDoctorJWT, updateAccountDetails)

export default router;