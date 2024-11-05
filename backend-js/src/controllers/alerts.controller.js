import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Alert } from "../models/alerts.model.js";

const sendAlert = asyncHandler(async(req, res)=>{
    const {doctorId} = req.params;
    const {message} = req.body;

    if(!mongoose.Types.ObjectId.isValid(doctorId)){
        throw new ApiError(404, "Doctor Id does not exist");
    }

    const newAlert = await Alert.create({
        owner: req.user2._id,
        message,
    })

    if(!newAlert){
        throw new ApiError(500, "Unable to generate new alert");
    }

    return res.status(200).json(new ApiResponse(201, newAlert, "Alert generated successfully"));
});

// View Alerts
const viewAlerts = asyncHandler(async (req, res) => {
    const alerts = await Alert.find()
        .populate("owner", "name") // Assuming doctor details include a 'name' field
        .sort({ createdAt: -1 });

    if (!alerts) {
        throw new ApiError(404, "No alerts found");
    }

    return res.status(200).json(new ApiResponse(200, alerts, "Alerts fetched successfully"));
});

// Edit Alert
const editAlert = asyncHandler(async (req, res) => {
    const { alertId } = req.params;
    const { message } = req.body;

    const alert = await Alert.findById(alertId);

    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    // Only the doctor who posted the alert can edit it
    if (alert.owner.toString() !== req.user2._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this alert");
    }

    alert.message = message;
    const updatedAlert = await alert.save();

    return res.status(200).json(new ApiResponse(200, updatedAlert, "Alert updated successfully"));
});

// Delete Alert
const deleteAlert = asyncHandler(async (req, res) => {
    const { alertId } = req.params;

    const alert = await Alert.findById(alertId);

    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    // Only the doctor who posted the alert can delete it
    if (alert.owner.toString() !== req.user2._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this alert");
    }

    await Alert.deleteOne({ _id: alertId });

    return res.status(200).json(new ApiResponse(200, null, "Alert deleted successfully"));
});


export {sendAlert, viewAlerts, editAlert, deleteAlert};