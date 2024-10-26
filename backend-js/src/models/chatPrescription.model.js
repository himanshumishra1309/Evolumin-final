import mongoose, { Schema } from 'mongoose';

const chatPrescriptionSchema = new Schema(
{
    
},
{ timestamps: true });

export const ChatPrescription = mongoose.model('ChatPrescription', chatPrescriptionSchema);