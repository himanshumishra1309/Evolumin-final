import mongoose, { Schema } from 'mongoose';

const alertSchema = new Schema(
{
    owner:{
        type: Schema.Types.ObjectId,
        ref: "Doctor"
    },
    message: {
        type: String,
        required: true,
    }
},
{ timestamps: true });
                                                                                           
export const Alert = mongoose.model('Alert', alertSchema);