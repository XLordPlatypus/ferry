import express from "express";
import {newResponseMessage} from "../helper/responseMessageProvider";
import {vehicleHeightService} from "../schemes/vehicle/vehicleHeight/vehicleHeightSchema";
import {vehicleLengthService} from "../schemes/vehicle/vehicleLength/vehicleLengthSchema";
import {trailerLengthService} from "../schemes/vehicle/trailerLength/trailerLengthSchema";

const SizeRouter = express.Router()

SizeRouter.get('/', async (req, res) => {
    try {
        const vehicleHeight = await vehicleHeightService.find()
        const vehicleLength = await vehicleLengthService.find()
        const trailerLength = await trailerLengthService.find()
        
        const sizes = {
            vehicleHeight: vehicleHeight,
            vehicleLength: vehicleLength,
            trailerLength: trailerLength
        }

        res.status(200).json(sizes)
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

export default SizeRouter