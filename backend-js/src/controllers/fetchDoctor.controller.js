import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Student } from "../models/student.model.js";
import { Doctor } from "../models/doctor.model.js";

const fetchPCPdata = asyncHandler(async(req, res)=>{});

const fetchDentistdata = asyncHandler(async(req, res)=>{});

const fetchPsychologistdata = asyncHandler(async(req, res)=>{});

const fetchDermatologistdata = asyncHandler(async(req, res)=>{});

const fetchAllergistdata = asyncHandler(async(req, res)=>{});

const fetchPhysicalTherapistdata = asyncHandler(async(req, res)=>{});