import mongoose from "mongoose";

export const routeSchema = new mongoose.Schema({
    from_destination: {
        type: String,
        required: true,
    },
    to_destination: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    }
})

export const routeService = mongoose.model('router', routeSchema)