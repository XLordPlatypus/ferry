import mongoose from "mongoose";

export const ferrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    ferry_capacity: {
        lower_deck: {
            label: {
                type: String,
                default: '< 2m'
            },
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 2,
            },
            space: {
                type: Number,
                default: 40,
            }
        },
        medium_deck: {
            label: {
                type: String,
                default: '2m - 2.6m',
            },
            min: {
                type: Number,
                default: 2,
            },
            max: {
                type: Number,
                default: 2.6,
            },
            space: {
                type: Number,
                default: 60,
            }
        },
        upper_deck: {
            label: {
                type: String,
                default: '> 2.6m',
            },
            min: {
                type: Number,
                default: 2.6,
            },
            max: {
                type: Number,
                default: 3,
            },
            space: {
                type: Number,
                default: 80,
            }
        },
        motorcycle_space: {
            type: Number,
            default: 10,
        },
    }
});


export const ferryService = mongoose.model('ferry', ferrySchema)