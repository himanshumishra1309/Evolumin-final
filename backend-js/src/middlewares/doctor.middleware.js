import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import {Doctor} from '../models/doctor.model.js'

export const verifyDoctorJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.doctorAccessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user2 = await Doctor.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user2) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user2 = user2;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})