import mongoose from "mongoose";

export const trailerLengthSchema = new mongoose.Schema({
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

export const trailerLengthService = mongoose.model('trailer_length', trailerLengthSchema)