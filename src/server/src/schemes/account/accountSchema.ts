import mongoose from "mongoose";
import {customerSchema} from "../customer/customerSchema";

export const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

export const accountService = mongoose.model('account', accountSchema)