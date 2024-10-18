import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser' 

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"));
app.use(cookieParser())


import studentRouter from './routes/student.routes.js'
import doctorRouter from './routes/doctor.routes.js'

app.use('/api/v1/students', studentRouter)
app.use('/api/v1/doctors', doctorRouter)

export {app}
