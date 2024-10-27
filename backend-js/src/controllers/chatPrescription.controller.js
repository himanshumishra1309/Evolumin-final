import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Student } from "../models/student.model.js";
import { Doctor } from "../models/doctor.model.js";
import { ChatPrescription } from "../models/chatPrescription.model.js";
import mongoose from "mongoose";

const addPrescriptions = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { prescriptions } = req.body;

    // Validate the presence of required fields
    if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
        throw new ApiError(400, "Invalid input. Prescriptions array is required.");
    }

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found.");
    }

    // Validate prescription structure
    prescriptions.forEach(prescription => {
        if (!prescription.name || !prescription.quantity || !Array.isArray(prescription.dosage)) {
            throw new ApiError(400, "Each prescription must have a name, quantity, and a dosage array.");
        }
        prescription.dosage.forEach(dose => {
            if (!dose.beforeAfter || !dose.meal) {
                throw new ApiError(400, "Each dosage must specify 'beforeAfter' and 'meal'.");
            }
        });
    });

    // Create a new session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create new prescription documents
        const newPrescriptions = await ChatPrescription.create(
            prescriptions.map(prescription => ({
                ...prescription,
                doctor: doctorId
            })),
            { session }
        );

        // Update doctor's prescriptions array
        await Doctor.findByIdAndUpdate(
            doctorId,
            { $push: { prescriptions: { $each: newPrescriptions.map(p => p._id) } } },
            { session }
        );

        await session.commitTransaction();

        // Respond with success message and new prescription details
        res.status(201).json(new ApiResponse(201, "Prescriptions added successfully", newPrescriptions));
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

const getDoctorPrescriptions = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found.");
    }

    // Fetch prescriptions for the doctor
    const prescriptions = await ChatPrescription.find({ doctor: doctorId })
        .populate('student', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "Doctor prescriptions retrieved successfully", prescriptions));
});

const getStudentPrescriptions = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found.");
    }

    // Fetch prescriptions for the student
    const prescriptions = await ChatPrescription.find({ student: studentId })
        .populate('doctor', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, "Student prescriptions retrieved successfully", prescriptions));
});

export { addPrescriptions, getDoctorPrescriptions, getStudentPrescriptions };