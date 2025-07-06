import mongoose from "mongoose";
import {routeSchema} from "./route/routeSchema";
import {ferrySchema} from "../ferry/ferrySchema";

export const tripSchema = new mongoose.Schema({
    route: {
        type: routeSchema,
        required: true,
    },
    departure_time: {
        type: Date,
        required: true,
    },
    arrival_time: {
        type: Date,
        required: true,
    },
    minPrice: {
        type: Number,
        required: true,
    },
    ferry: {
        type: ferrySchema,
        required: true,
    }
})

export const tripService = mongoose.model('trip', tripSchema)