import mongoose from "mongoose";
import {trailerLengthSchema} from "./trailerLength/trailerLengthSchema";
import {vehicleLengthSchema} from "./vehicleLength/vehicleLengthSchema";
import {vehicleHeightSchema} from "./vehicleHeight/vehicleHeightSchema";

export const vehicleSchema = new mongoose.Schema({
    account: {
        type: mongoose.Types.ObjectId,
        ref: 'account',
        required: false,
    },
    motorcycle: {
        type: Boolean,
        required: false,
    },
    height: {
        type: vehicleHeightSchema,
        required: false,
    },
    length: {
        type: vehicleLengthSchema,
        required: false,
    },
    trailer: {
        length: {
            type: trailerLengthSchema,
            required: false,
        },
        exists: {
            type: Boolean,
            required: false,
        },
    },
})

export const vehicleService = mongoose.model('vehicle', vehicleSchema)
