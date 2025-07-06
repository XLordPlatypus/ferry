import mongoose from "mongoose";
import {Status} from "../../constants/status";
import {vehicleSchema} from "../vehicle/vehicleSchema";
import {customerSchema} from "../customer/customerSchema";
import {tripSchema} from "../trip/tripSchema";

export const reservationSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: Status,
        default: Status.CONFIRMED,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    vehicle: {
        type: vehicleSchema,
        required: false,
    },
    customers: {
        type: [customerSchema],
        required: false,
    },
    trip: {
        type: tripSchema,
        required: false,
    },
})

export const reservationService = mongoose.model('reservation', reservationSchema)