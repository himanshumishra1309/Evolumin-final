import { asyncHandler } from "../utils/asyncHandler";
import { Appointment } from "../models/appointments.models";
import { AppointmentDate } from "../models/availabilityDates.models";
import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";

const createAppointment = asyncHandler(async (req, res) => {
    const {doctorId} = req.params;
    const {date, startTime, endTime} = req.body;

    if(mongoose.Types.ObjectId.isValid(doctorId)){
        throw new ApiError(400, "Doctor ID is invalid");
    }

    if([date, startTime, endTime].some((field)=> field.trim()==="")){
        return new ApiError(400, "All the field are required");
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    let slots = [];
  
    while (start < end) {
      const slotEnd = new Date(start.getTime() + 30 * 60000); // 30 minutes added
      slots.push({ startTime: new Date(start), endTime: slotEnd, isBooked: false });
      start.setTime(slotEnd.getTime()); // Move to the next 30-minute slot
    }

    const dates = await AppointmentDate.create({
        doctorId,
        date: new Date(date),
        slots
    })

    return res.status(201).json(new ApiResponse(201, dates, "Appointment created successfully"));
});

const getDoctorAvailability = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if(mongoose.Types.ObjectId.isValid(doctorId)){
        throw new ApiError(400, "Doctor ID is invalid");
    }

    const availability = await AppointmentDate.find({owner: doctorId}).select("date slots").lean();

    if(!availability || availability.length === 0){
        throw new ApiError(404, "No availability found for this doctor");
    }

    const filterDates = availability.map((entry) => ({
        date: entry.date,
        slots: entry.slots.filter((slot) => !slot.isBooked)
    }));

    return res.status(200).json(new ApiResponse(200, filterDates, "Doctor availability fetched successfully"));
});

const bookAppointment = asyncHandler(async (req, res) => {
    const {doctorId} = req.params;
    const {studentId, date, startTime, endTime, symptoms} = req.body;

    if (!doctorId || !studentId) {
        throw new ApiError(400, "Doctor ID and Student ID are required");
    }

    if ([date, startTime, endTime, symptoms].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const selectedDate = new Date(date);
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    // Find the availability record for the doctor on the selected date
    const availability = await AppointmentDate.findOne({
        owner: doctorId,
        date: selectedDate,
        'slots.startTime': start,
        'slots.endTime': end,
        'slots.isBooked': false // Ensure the slot is not already booked
    });

    if (!availability) {
        throw new ApiError(404, "Time slot not available or already booked");
    }

    // Mark the slot as booked
    availability.slots.forEach((slot) => {
        if (slot.startTime.getTime() === start.getTime() && slot.endTime.getTime() === end.getTime()) {
            slot.isBooked = true;
        }
    });

    await availability.save();

    // Create the appointment for the student
    const appointment = await Appointment.create({
        student: studentId,
        doctor: doctorId,
        date: selectedDate,
        startTime: start,
        endTime: end,
        symptoms
    });

    return res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!doctorId) {
        throw new ApiError(400, "Doctor ID is required");
    }

    // Fetch all appointments for the doctor
    const appointments = await Appointment.find({ doctor: doctorId })
        .populate('student', 'name')  // Assuming 'name' is the field in the Student model
        .sort({ date: 1, startTime: 1 }); // Sorted by date and time

    if (!appointments.length) {
        return res.status(404).json(new ApiResponse(404, [], "No appointments found for this doctor"));
    }

    // Formatting the data for response
    const appointmentDetails = appointments.map(appointment => ({
        studentName: appointment.student.name,
        date: appointment.date.toDateString(),
        startTime: appointment.startTime.toLocaleTimeString(),
        endTime: appointment.endTime.toLocaleTimeString(),
        symptoms: appointment.symptoms,
    }));

    return res.status(200).json(new ApiResponse(200, appointmentDetails, "Doctor's appointments fetched successfully"));
});

export { createAppointment, getDoctorAvailability, bookAppointment, getDoctorAppointments };