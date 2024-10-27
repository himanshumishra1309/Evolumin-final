import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Report } from "../models/studentReport.model.js";
import { Student } from "../models/student.model.js";

// Helper function to verify the existence of the student by email
const verifyStudentByEmail = async (email) => {
    console.log('Searching for student with email:', email); // Debug log
    const student = await Student.findOne({ email: email.trim().toLowerCase() });
    console.log('Found student:', student); // Debug log
    if (!student) {
      throw new ApiError(404, "Student not found.");
    }
    return student;
  };

// 1. Controller for doctor to add a report
const addReport = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { name, dob, blood_group, medications, allergies, diseases } = req.body;

  if ([name, email, dob, blood_group, medications, allergies, diseases].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  await verifyStudentByEmail(email);

  const report = await Report.create({
    name,
    email,
    dob,
    blood_group,
    medications,
    allergies,
    diseases,
    date: new Date(),
  });

  res.json(new ApiResponse(201, report, "Report added successfully"));
});

// 2. Controller for doctor to view all reports of a student
const getAllReports = asyncHandler(async (req, res) => {
  const { email } = req.params;

  await verifyStudentByEmail(email);

  const reports = await Report.find({ email }).sort({ date: -1 });
  if (!reports || reports.length === 0) {
    throw new ApiError(404, "No reports found for this student.");
  }

  res.json(new ApiResponse(200,  reports, "All reports retrieved successfully"));
});


const getLatestReportByDoctor = asyncHandler(async (req, res) => {
    const { studentEmail } = req.params;
  
    // Verify if the student exists
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      throw new ApiError(404, "Student not found");
    }
  
    // Find the latest report for the student
    const latestReport = await Report.findOne({ email: studentEmail })
      .sort({ date: -1 })
      .lean();
  
    if (!latestReport) {
      return res.status(404).json(
        new ApiResponse(404, null, "No report found for this student")
      );
    }
  
    // Return the latest report
    return res.status(200).json(
      new ApiResponse(200, latestReport, "Latest report retrieved successfully")
    );
});
  

// 3. Controller for doctor to edit the latest report of a student
const editLatestReport = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const updates = req.body;
  
    await verifyStudentByEmail(email);
  
    const latestReport = await Report.findOne({ email }).sort({ date: -1 });
    if (!latestReport) {
      throw new ApiError(404, "No reports found for this student.");
    }
  
    // Validate updates
    for (const [key, value] of Object.entries(updates)) {
      if (key in latestReport.schema.paths) {
        latestReport[key] = value;
      }
    }
  
    await latestReport.save();
  
    return res.status(200).json(new ApiResponse(200, latestReport, "Latest report updated successfully"));
});

// 4. Controller for student to view their latest monthly report
const getLatestReport = asyncHandler(async (req, res) => {
  const { email } = req.params;

  await verifyStudentByEmail(email);

  const latestReport = await Report.findOne({ email }).sort({ date: -1 });
  if (!latestReport) {
    throw new ApiError(404, "No reports found.");
  }

  return res.status(200).json(new ApiResponse(200, latestReport, "Latest report retrieved successfully"));
});

// 5. Controller for student to view all past reports at once
const getAllPastReports = asyncHandler(async (req, res) => {
    const { email } = req.params;
  
    await verifyStudentByEmail(email);
  
    const pastReports = await Report.find({ email }).sort({ date: -1 });
    if (pastReports.length === 0) {
      throw new ApiError(404, "No reports found.");
    }
  
    return res.status(200).json(new ApiResponse(200, pastReports, "All past reports retrieved successfully"));
});

export { addReport, getAllReports, editLatestReport, getLatestReport, getAllPastReports, getLatestReportByDoctor };