import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from 'bcrypt' 

const doctorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        speciality: {
            type: String,
            required: true,
            trim: true,
        },
        qualification: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        experience:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        currently_working:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        password:{
            type: String,
            required: [true, "Password is required"],
        },
    }
, {timestamps: true})

doctorSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); 

    this.password = await bcrypt.hash(this.password, 10) 
    next();
})

doctorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

doctorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }, 
    )
}


doctorSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this.id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },
    )
}

export const Doctor = mongoose.model("Doctor", doctorSchema)