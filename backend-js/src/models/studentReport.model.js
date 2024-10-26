import mongoose, { Schema } from 'mongoose';

const reportSchema = new Schema(
{
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    dob:{
        type: Date,
        required: true,
    },
    blood_group:{
        type: String,
        required: true,
    },
    medications:{
        type: String,
        required: true,
    },
    allergies:{
        type: String,
        required: true,
    },
    diseases:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true, 
    }
},
{ timestamps: true });

export const Report = mongoose.model('Report', reportSchema);