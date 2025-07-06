import mongoose from "mongoose";
import {tripService} from "./tripSchema";
import {faker} from "@faker-js/faker";

export const getFakeTrip = (route: mongoose.Document, ferry: mongoose.Document) => {
    const departure_time = faker.date.future().getTime();

    const minDuration = 60 * 60 * 1000;
    const maxDuration = 48 * 60 * 60 * 1000;
    const tripDuration = faker.number.int({min: minDuration, max: maxDuration});

    const arrival_time = departure_time + tripDuration;

    return new tripService({
        route: route,
        departure_time: departure_time,
        arrival_time: arrival_time,
        minPrice: faker.commerce.price(),
        ferry: ferry,
    });
};