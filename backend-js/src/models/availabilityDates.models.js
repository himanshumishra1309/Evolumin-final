import mongoose, { Schema } from 'mongoose';

const dateSchema = new Schema(
{
    date: {
        type: Date,
        required: true,
        index: true,
    },
    slots: [{
        startTime:
        {
            type: Date,
            required: true
        },
        
        endTime:
        {
            type: Date,
            required: true
        },

        isBooked:
        {
            type: Boolean,
            default: false
        }
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
},
{ timestamps: true });

export const AppointmentDate = mongoose.model('AppointmentDate', dateSchema);