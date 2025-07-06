import {vehicleHeightService} from "./vehicleHeightSchema";
import {faker} from "@faker-js/faker";
import mongoose from "mongoose";

export const generateVehicleHeight = (label: string, min: number, max: number) => {
    return new vehicleHeightService({
        label: label,
        min: min,
        max: max,
    })
}

export const generateVehicleHeightById = (id: mongoose.Types.ObjectId) => {
    return vehicleHeightService.findOne({ _id: id });
}