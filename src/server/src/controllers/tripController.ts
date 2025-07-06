import express from "express";
import {tripService} from "../schemes/trip/tripSchema";
import {newResponseMessage} from "../helper/responseMessageProvider";
import {
    hasCapacityForNewVehicle,
    hasLowerDeckCapacity,
    hasMediumDeckCapacity,
    hasMotorcycleCapacity,
    hasUpperDeckCapacity,
    Trip
} from "../helper/ferryCapacityHelper";

const tripRouter = express.Router()

tripRouter.get('/', async (req, res) => {
    try {
        const trips = await tripService.find()
        if (trips) {
            res.status(200).json(trips)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'No Trips found'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.get('/:tripID', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID)
        if (trip) {
            res.status(200).json(trip)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.get('/:tripID/hasLowerDeckCapacity', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID) as Trip & Document;
        if (trip) {
            const hasCapacity = await hasLowerDeckCapacity(trip)
            res.status(200).json(hasCapacity)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.get('/:tripID/hasMediumDeckCapacity', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID) as Trip & Document;
        if (trip) {
            const hasCapacity = await hasMediumDeckCapacity(trip)
            res.status(200).json(hasCapacity)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.get('/:tripID/hasUpperDeckCapacity', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID) as Trip & Document;
        if (trip) {
            const hasCapacity = await hasUpperDeckCapacity(trip)
            res.status(200).json(hasCapacity)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.get('/:tripID/hasMotorcycleCapacity', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID) as Trip & Document;
        if (trip) {
            const hasCapacity = await hasMotorcycleCapacity(trip)
            res.status(200).json(hasCapacity)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.get('/:tripID/hasCapacity', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID) as Trip & Document;
        if (trip) {
            const hasCapacity = await hasMotorcycleCapacity(trip)
            const hasLowerDeckCap = await hasLowerDeckCapacity(trip)
            const hasMediumDeckCap = await hasMediumDeckCapacity(trip)
            const hasUpperDeckCap = await hasUpperDeckCapacity(trip)
            res.status(200).json(hasCapacity && hasLowerDeckCap && hasMediumDeckCap && hasUpperDeckCap)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

tripRouter.post('/:tripID/hasVehicleCapacity', async (req, res) => {
    try {
        const trip = await tripService.findById(req.params.tripID) as Trip & Document;
        if (trip) {
            const vehicle = req.body
            const hasCapacity = await hasCapacityForNewVehicle(vehicle, trip)
            res.status(200).json(hasCapacity)
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})
export default tripRouter