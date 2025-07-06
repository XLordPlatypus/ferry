import mongoose from "mongoose";

export const vehicleHeightSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true
    }
})

export const vehicleHeightService = mongoose.model('vehicle_height', vehicleHeightSchema)