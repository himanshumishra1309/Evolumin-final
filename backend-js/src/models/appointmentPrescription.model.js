import mongoose, { Schema } from 'mongoose';

const appointmentPrescriptionSchema = new Schema(
{
    precaution: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    medicines: {
        type: String,
        required: true,
        trim: true,
        index: true,
    }
},
{ timestamps: true });

export const AppointmentPrescription = mongoose.model('AppointmentPrescription', appointmentPrescriptionSchema);