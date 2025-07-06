import {vehicleLengthService} from "./vehicleLengthSchema";
import {faker} from "@faker-js/faker";
import mongoose from "mongoose";

export const generateVehicleLength = (label: string, min: number, max: number) => {
    return new vehicleLengthService({
        label: label,
        min: min,
        max: max,
    })
}

export const generateVehicleLengthById = (id: mongoose.Types.ObjectId) => {
    return vehicleLengthService.findOne({ _id: id })
}