import mongoose, { Schema } from 'mongoose';

const appointmentPrescriptionSchema = new Schema(
{
    
},
{ timestamps: true });

export const AppointmentPrescription = mongoose.model('AppointmentPrescription', appointmentPrescriptionSchema);