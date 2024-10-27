import { ApiError } from '../utils/ApiErrors.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {Student} from '../models/student.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await Student.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); 

        return {refreshToken, accessToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req,res) => {

    const {roll_no, email, dob, name, password, academic_year, hostel, room_no} = req.body;
    console.log('email: ', email);
    console.log('req.body: ', req.body);

  
    if([email, name, password, dob, roll_no, academic_year, hostel, room_no].some((field) => field?.trim() === "")){
        throw new ApiError(400, "fullname is required");
    }

    const existedUser = await Student.findOne({email})

    if(existedUser){
        throw new ApiError(409, "User with email already exists")
    }

    const user = await Student.create({
        name: name,
        email,
        dob,
        roll_no, 
        academic_year, 
        hostel, 
        room_no,
        password
    })

    const createdUser = await Student.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
    .status(201)
    .cookie("studentAccessToken", accessToken, options)
    .cookie("studentRefreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {user:createdUser, accessToken, refreshToken}, "User Registered Successfully")
    )
}) 

const loginUser = asyncHandler(async(req, res)=>{

    console.log("request : ", req);
    console.log("request's body : ", req.body);
    const {email, password} = req.body;

    if(!email){
        throw new ApiError (400, "email is required")
    }

    const user = await Student.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await Student.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
    .status(200)
    .cookie("studentAccessToken", accessToken, options)
    .cookie("studentRefreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res)=>{
  await Student.findByIdAndUpdate(
    req.user._id,
    
    {
      $unset:{
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )
  
  const options = {
    httpOnly: true,
    secure: true
  }
  
  return res.status(200).clearCookie("studentAccessToken", options).clearCookie("studentRefreshToken", options).json(new ApiResponse(200, {}, "User logged out"))
}) 


const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await Student.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user){
            throw new ApiError(401, "Refresh Token Expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
        return res.status(200).cookie("studentAccessToken", accessToken, options).cookie("studentRefreshToken", newRefreshToken, options)
        .json(new ApiResponse(
            200,
            {
                accessToken,
                refreshToken: newRefreshToken,
            },
            "Access Token Refreshed"
        ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})


const changeCurrentPassword = asyncHandler(async (req, res)=>{
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await User.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old Password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"))
}) 

const getCurrentUser = asyncHandler(async (req, res)=>{
  return res.status(200).json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  console.log("req.body of update account details: ", req.body);
  
  // Destructure the required fields from the request body
  const { name, email, roll_no, room_no, hostel, academic_year, dob } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !roll_no || !room_no || !hostel || !academic_year || !dob) {
    throw new ApiError(400, "All fields are required");
  }

  // Update the student's details in the database
  const user = await Student.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        email,
        roll_no,
        academic_year, // Ensure academic_year is used instead of year
        hostel,
        room_no,
        dob, // Include dob field in the update
      },
    },
    { new: true } // Return the updated document
  ).select("-password"); // Exclude the password from the response

  // Check if the user was found and updated
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Respond with the updated user data
  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const fetchAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).select("-password -refreshToken");

  if (!students || students.length === 0) {
    throw new ApiError(404, "No students found");
  }

  return res.status(200).json(new ApiResponse(200, students, "All students fetched successfully"));
});

export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, fetchAllStudents}
