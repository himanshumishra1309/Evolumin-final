import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppointmentDate } from "../models/availabilityDates.models.js";
import { Appointment } from "../models/appointments.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Asia/Kolkata";

const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { date, startTime, endTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, "Doctor ID is invalid");
    }

    if ([date, startTime, endTime].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All the fields are required");
    }

    const startDateTime = dayjs.tz(`${date} ${startTime}`, TIMEZONE);
    const endDateTime = dayjs.tz(`${date} ${endTime}`, TIMEZONE);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
        throw new ApiError(400, "Invalid date or time format");
    }

    // Check if the date already has appointments
    const existingAppointment = await AppointmentDate.findOne({
        owner: doctorId,
        date: startDateTime.startOf('day').toDate()
    });

    if (existingAppointment) {
        throw new ApiError(400, "This date already has appointments scheduled. Please cancel the existing shift first.");
    }

    let slots = [];
    let currentSlot = startDateTime;

    while (currentSlot.isBefore(endDateTime)) {
        const slotEnd = currentSlot.add(30, 'minute');
        slots.push({
            startTime: currentSlot.toDate(),
            endTime: slotEnd.toDate(),
            isBooked: false,
        });
        currentSlot = slotEnd;
    }

    const appointmentDate = await AppointmentDate.create({
        owner: doctorId,
        date: startDateTime.startOf('day').toDate(),
        slots,
    });

    const formattedResponse = {
        date: dayjs(appointmentDate.date).tz(TIMEZONE).format('YYYY-MM-DD'),
        slots: appointmentDate.slots.map(slot => ({
            startTime: dayjs(slot.startTime).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(slot.endTime).tz(TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
            isBooked: slot.isBooked,
            _id: slot._id.toString()
        })),
        owner: appointmentDate.owner.toString()
    };
      
    return res.status(201).json(new ApiResponse(201, formattedResponse, "Appointment created successfully"));
});

const cancelShift = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, "Doctor ID is invalid");
    }

    if (!date) {
        throw new ApiError(400, "Date is required");
    }

    const cancelDate = dayjs.tz(date, TIMEZONE).startOf('day');
    console.log("Cancel Date:", cancelDate.toDate());

    const result = await AppointmentDate.findOneAndDelete({
        owner: doctorId,
        date: cancelDate.toDate()
    });

    if (!result) {
        throw new ApiError(404, "No shift found for the specified date");
    }

    // Log the result to confirm deletion
    console.log("Shift deleted:", result);

    // Remove all appointments for this date
    await Appointment.deleteMany({
        doctor: doctorId,
        date: cancelDate.toDate()
    });

    return res.status(200).json(new ApiResponse(200, { date: cancelDate.format('YYYY-MM-DD') }, "Shift cancelled successfully"));
});

const fetchAllDates = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, "Doctor ID is invalid");
    }

    const dates = await AppointmentDate.find({ owner: doctorId })
        .select("date slots.startTime slots.endTime")
        .lean();

    if (!dates || dates.length === 0) {
        throw new ApiError(404, "No dates found for this doctor");
    }

    const formattedDates = dates.map((entry) => {
        const startTimes = entry.slots.map(slot => dayjs(slot.startTime).tz(TIMEZONE));
        const endTimes = entry.slots.map(slot => dayjs(slot.endTime).tz(TIMEZONE));
        
        const earliestStart = startTimes.reduce((min, current) => current.isBefore(min) ? current : min, startTimes[0]);
        const latestEnd = endTimes.reduce((max, current) => current.isAfter(max) ? current : max, endTimes[0]);

        return {
            date: dayjs(entry.date).tz(TIMEZONE).format('YYYY-MM-DD'),
            startTime: earliestStart.format('HH:mm:ss'),
            endTime: latestEnd.format('HH:mm:ss')
        };
    });

    const uniqueFormattedDates = Array.from(new Set(formattedDates.map(JSON.stringify))).map(JSON.parse);

    return res.status(200).json(new ApiResponse(200, uniqueFormattedDates, "Doctor dates and slots fetched successfully"));
});

const getDoctorAvailability = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, "Doctor ID is invalid");
    }

    const availability = await AppointmentDate.find({owner: doctorId}).select("date slots").lean();

    if(!availability || availability.length === 0){
        throw new ApiError(404, "No availability found for this doctor");
    }

    const filterDates = availability.map((entry) => ({
        date: dayjs(entry.date).tz(TIMEZONE).format('YYYY-MM-DD'),
        slots: entry.slots.filter((slot) => !slot.isBooked).map(slot => ({
            startTime: dayjs(slot.startTime).tz(TIMEZONE).format('HH:mm:ss'),
            endTime: dayjs(slot.endTime).tz(TIMEZONE).format('HH:mm:ss'),
            isBooked: slot.isBooked
        }))
    }));

    return res.status(200).json(new ApiResponse(200, filterDates, "Doctor availability fetched successfully"));
});

const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { studentId, date, startTime, endTime, symptoms } = req.body;

    if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(studentId)) {
        throw new ApiError(400, "Invalid Doctor ID or Student ID");
    }

    if ([date, startTime, endTime, symptoms].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const selectedDate = dayjs.tz(date, TIMEZONE).startOf('day');
    const start = dayjs.tz(`${date} ${startTime}`, TIMEZONE);
    const end = dayjs.tz(`${date} ${endTime}`, TIMEZONE);

    const availability = await AppointmentDate.findOne({
        owner: doctorId,
        date: selectedDate.toDate(),
        'slots.startTime': start.toDate(),
        'slots.endTime': end.toDate(),
        'slots.isBooked': false
    });

    if (!availability) {
        throw new ApiError(404, "Time slot not available or already booked");
    }

    availability.slots.forEach((slot) => {
        if (dayjs(slot.startTime).isSame(start) && dayjs(slot.endTime).isSame(end)) {
            slot.isBooked = true;
        }
    });

    await availability.save();

    const appointment = await Appointment.create({
        student: studentId,
        doctor: doctorId,
        date: selectedDate.toDate(),
        startTime: start.toDate(),
        endTime: end.toDate(),
        symptoms
    });

    const formattedAppointment = {
        ...appointment.toObject(),
        date: dayjs(appointment.date).tz(TIMEZONE).format('YYYY-MM-DD'),
        startTime: dayjs(appointment.startTime).tz(TIMEZONE).format('HH:mm:ss'),
        endTime: dayjs(appointment.endTime).tz(TIMEZONE).format('HH:mm:ss'),
    };

    return res.status(201).json(new ApiResponse(201, formattedAppointment, "Appointment booked successfully"));
});

const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, "Invalid Doctor ID");
    }

    const appointments = await Appointment.find({ doctor: doctorId })
        .populate('student', 'name')
        .sort({ date: 1, startTime: 1 });

    if (!appointments.length) {
        return res.status(404).json(new ApiResponse(404, [], "No appointments found for this doctor"));
    }

    const appointmentDetails = appointments.map(appointment => ({
        studentName: appointment.student.name,
        date: dayjs(appointment.date).tz(TIMEZONE).format('YYYY-MM-DD'),
        startTime: dayjs(appointment.startTime).tz(TIMEZONE).format('HH:mm:ss'),
        endTime: dayjs(appointment.endTime).tz(TIMEZONE).format('HH:mm:ss'),
        symptoms: appointment.symptoms,
    }));

    return res.status(200).json(new ApiResponse(200, appointmentDetails, "Doctor's appointments fetched successfully"));
});

export { createAppointment, fetchAllDates, getDoctorAvailability, bookAppointment, getDoctorAppointments, cancelShift };