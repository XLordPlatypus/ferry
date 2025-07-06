import mongoose from "mongoose";
import {reservationService} from "./reservationSchema";
import {faker} from "@faker-js/faker";

export const getFakeReservation = (
    vehicle: mongoose.Document,
    customers: mongoose.Document[],
    trip: any,
) => {
    return new reservationService({
        price: trip.minPrice + faker.number.int({min: 0, max: 100}),
        vehicle: vehicle,
        customers: customers,
        trip: trip,
    });
};
