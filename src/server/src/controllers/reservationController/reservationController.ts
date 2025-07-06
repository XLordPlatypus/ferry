import express from "express";
import {newResponseMessage} from "../../helper/responseMessageProvider";
import {reservationService} from "../../schemes/reservation/reservationSchema";
import {customerService} from "../../schemes/customer/customerSchema";
import {accountService} from "../../schemes/account/accountSchema";
import {getSession} from "../../authentication/sessionStorage";
import {hasCapacityForNewVehicle, Trip} from "../../helper/ferryCapacityHelper";
import {tripService} from "../../schemes/trip/tripSchema";
import {an} from "@faker-js/faker/dist/airline-CBNP41sR";
import {reservationValidator} from "./reservationValidator";
import {sendMail} from "../../helper/mailer";

const reservationController = express.Router()

reservationController.get('/', async (req, res) => {
    try {

        if (!req.session.sessionToken) {
            res.status(404).json(newResponseMessage(false, {}, ''))
            return
        }

        const session = getSession(req.session.sessionToken)
        const userAccount = await accountService.findById(session?.userID)

        if(!userAccount) {
            res.status(404).json(newResponseMessage(false, {}, 'Account not found!'))
            return
        }

        const userCustomers = await customerService.find({ account: userAccount._id })
        if (!userCustomers || userCustomers.length === 0) {
            res.status(404).json(newResponseMessage(false, {}, 'No customers found for this account'))
            return
        }

        const customerIds = userCustomers.map(c => c._id)
        const userReservations = await reservationService.find({
            'customers._id': { $in: customerIds }
        })

        if (!userReservations || userReservations.length === 0) {
            res.status(404).json(newResponseMessage(false, {}, 'No reservations found'))
            return
        }

        res.status(200).json(userReservations)
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

reservationController.get('/:id', async (req, res) => {
    try {
        if (!req.session.sessionToken) {
            res.status(404).json(newResponseMessage(false, {}, 'Session not found!'))
            return
        }

        const session = getSession(req.session.sessionToken)

        if (!session) {
            res.status(404).json(newResponseMessage(false, {}, 'Session not found!'))
            return
        }

        const userAccount = await accountService.findById(session.userID)

        const userReservation = await reservationService.findById(req.params.id)
        if (!userReservation || !userAccount) {
            res.status(404).json(newResponseMessage(false, {}, 'Reservation not found'))
            return
        }

        const userCustomers = await customerService.find({ account: userAccount._id })
        const userCustomerIds = userCustomers.map(c => c._id.toString())

        const reservationCustomers = userReservation.customers || []
        const isUserReservation = reservationCustomers.some(resCustomer =>
            userCustomerIds.includes(resCustomer._id.toString())
        )

        if (isUserReservation) {
            res.status(200).json(userReservation)
        } else {
            res.status(403).json(newResponseMessage(false, {}, 'Reservation does not belong to this user'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

reservationController.post('/', async (req, res) => {
    const { error } = reservationValidator.validate(req.body)
    if (error) {
        res.status(403).json(newResponseMessage(false, error?.toString(), 'Reservation not valid!'))
    } else {
        try {
            if (req.body.vehicle && req.body.tripId) {
                const trip: any | null = await tripService.findById(req.body.tripId)
                if (!trip) {
                    res.status(404).json(newResponseMessage(false, {}, 'Trip not found!'))
                } else {
                    const vehicle = req.body.vehicle
                    const hasSpace = await hasCapacityForNewVehicle(vehicle, trip)
                    if (hasSpace) {
                        req.body.trip = trip
                        const insertResult = await reservationService.insertOne(req.body);
                        req.body._id = insertResult._id;
                        sendMail(req.body);

                        res.status(201).json(newResponseMessage(true, {}, 'Reservation created successfully!'))
                    } else {
                        res.status(403).json(newResponseMessage(false, {}, 'Ferry has no capacity left'))
                    }
                }
            } else {
                res.status(403).json(newResponseMessage(false, {}, 'Please provide valid info'))
            }
        } catch (e) {
            res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
        }
    }
})

reservationController.put('/:id', async (req, res) => {
    try {
        if (!req.session.sessionToken) {
            res.status(404).json(newResponseMessage(false, {}, 'Session not found!'))
            return
        }

        const session = getSession(req.session.sessionToken)

        if (!session) {
            res.status(404).json(newResponseMessage(false, {}, 'Session not found!'))
            return
        }

        const userAccount = await accountService.findById(session.userID)

        const existingReservation = await reservationService.findById(req.params.id)
        if (!existingReservation || !userAccount) {
            res.status(404).json(newResponseMessage(false, {}, 'Reservation not found'))
            return
        }

        const userCustomers = await customerService.find({ account: userAccount._id })
        const userCustomerIds = userCustomers.map(c => c._id.toString())

        const reservationCustomers = existingReservation.customers || []
        const isUserReservation = reservationCustomers.some(resCustomer =>
            userCustomerIds.includes(resCustomer._id.toString())
        )

        if (!isUserReservation) {
            res.status(403).json(newResponseMessage(false, {}, 'Cannot update a reservation that does not belong to this user'))
            return
        }

        res.status(200).json(newResponseMessage(true, {}, 'Reservation updated successfully!'))
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'))
    }
})

export default reservationController