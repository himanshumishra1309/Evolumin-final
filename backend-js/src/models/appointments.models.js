import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new Schema(
{
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
},
{ timestamps: true });

export const Appointment = mongoose.model('Appointment', appointmentSchema);