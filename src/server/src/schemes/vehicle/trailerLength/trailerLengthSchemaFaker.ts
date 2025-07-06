import {trailerLengthService} from "./trailerLengthSchema";
import {faker} from "@faker-js/faker";
import mongoose from "mongoose";

export const generateTrailerLength = (label: string ,min: number, max: number) => {
    return new trailerLengthService({
        label: label,
        min: min,
        max: max,
    })
}

export const generateTrailerLengthById = (id: mongoose.Types.ObjectId) => {
    return trailerLengthService.findOne({ _id: id })
}