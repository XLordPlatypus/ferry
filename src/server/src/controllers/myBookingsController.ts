import express from "express";
import {newResponseMessage} from "../helper/responseMessageProvider";
import {getSession} from "../authentication/sessionStorage";
import {customerService} from "../schemes/customer/customerSchema";
import {reservationService} from "../schemes/reservation/reservationSchema";
import mongoose, {mongo} from "mongoose";

const myBookingsController = express.Router()

myBookingsController.get('/', async (req, res) => {
    try {
        if (!req.session.sessionToken) {
            res.status(401).json(newResponseMessage(false, {}, 'No session token provided'));
            return
        }

        const session = getSession(req.session.sessionToken);
        if (!session) {
            res.status(404).json(newResponseMessage(false, {}, 'No customer found'));
            return
        }

        const customer = await customerService.findOne({account: session.userID});
        if (!customer) {
            res.status(404).json(newResponseMessage(false, {}, 'No customer found'));
            return
        }

        const customerReservations = await reservationService.find();

        const all = [];

        for (const reservation of customerReservations) {
            const resCustomerId = reservation?.customers?.[0]?._id?.toString();
            const customerId = customer._id?.toString();

            if (resCustomerId && resCustomerId === customerId) {
                all.push(reservation);
            }
        }



        res.status(200).json(all);
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'));
    }
});

myBookingsController.post('/cancel/:bookingId', async (req, res) => {
    try {
        const {bookingId} = req.params;

        if (!req.session.sessionToken) {
            res.status(401).json(newResponseMessage(false, {}, 'No session token provided'));
            return;
        }

        const session = getSession(req.session.sessionToken);
        if (!session) {
            res.status(404).json(newResponseMessage(false, {}, 'No customer found'));
            return;
        }

        const customer = await customerService.findOne({account: session.userID});
        if (!customer) {
            res.status(404).json(newResponseMessage(false, {}, 'Customer not found'));
            return;
        }

        const reservation = await reservationService.findById(bookingId);
        if (!reservation) {
            res.status(404).json(newResponseMessage(false, {}, 'Booking not found'));
            return;
        }

        if (reservation.customers) {
            const isCustomerReservation = reservation.customers.some((reservationCustomer: any) => {
                return reservationCustomer._id.toString() === customer._id.toString();
            });

            if (!isCustomerReservation) {
                res.status(403).json(newResponseMessage(false, {}, 'You are not authorized to cancel this booking'));
                return;
            }

            if (reservation.status !== 'CONFIRMED') {
                res.status(400).json(newResponseMessage(false, {}, 'Only confirmed bookings can be cancelled'));
                return;
            }

            const updatedReservation = await reservationService.findByIdAndUpdate(
                bookingId,
                {status: 'CANCELLED'},
                {new: true}
            );

            if (!updatedReservation) {
                res.status(500).json(newResponseMessage(false, {}, 'Failed to cancel booking'));
                return;
            }
            res.status(200).json(newResponseMessage(true, {}, 'Booking cancelled successfully'));
        } else {
            res.status(404).json(newResponseMessage(false, {}, 'Booking not found'));
            return;
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, {error: e?.toString()}, 'Internal Server Error'));
    }
});
export default myBookingsController