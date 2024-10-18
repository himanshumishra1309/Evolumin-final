import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const studentSchema = new Schema(
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
        roll_no: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        year:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        hostel:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        room_no:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        password:{
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        }
    }
, {timestamps: true})

studentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); 

    this.password = await bcrypt.hash(this.password, 10) 
    next();
})

studentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); 
}


studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            email: this.email
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }, 
    )
}

studentSchema.methods.generateRefreshToken = function () {
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

export const Student = mongoose.model("Student", studentSchema)