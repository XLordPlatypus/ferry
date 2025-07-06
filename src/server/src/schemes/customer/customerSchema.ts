import mongoose from "mongoose";
import {Gender} from "../../constants/gender";

export const customerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Types.ObjectId,
        ref: 'account',
        required: false,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: Gender,
        default: Gender.MALE,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    driver_license: {
        country_code: {
            type: String,
            required: false,
        },
        license_number: {
            type: String,
            required: false,
        },
        date_of_issue: {
            type: Date,
            required: false,
        },
    },
    address: {
        city: {
            type: String,
            required: true,
        },
        postal_code: {
            type: String,
            required: true,
        },
        house_number: {
            type: String,
            required: true,
        },
        house_number_addon: {
            type: String,
            required: false,
        },
        street: {
            type: String,
            required: true,
        },
    },
})

export const customerService = mongoose.model('customer', customerSchema)
