import mongoose from "mongoose";

export const vehicleLengthSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
    }
})

export const vehicleLengthService = mongoose.model('vehicle_length', vehicleLengthSchema)