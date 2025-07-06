import {customerService} from "../schemes/customer/customerSchema";
import {generateCustomer, getFakeCustomer} from "../schemes/customer/customerSchemaFaker";
import {ferryService} from "../schemes/ferry/ferrySchema";
import {getFakeFerry} from "../schemes/ferry/ferrySchemaFaker";
import {getFakeVehicle} from "../schemes/vehicle/vehicleSchemaFaker";
import {generateVehicleHeight} from "../schemes/vehicle/vehicleHeight/vehicleHeightSchemaFaker";
import {generateVehicleLength} from "../schemes/vehicle/vehicleLength/vehicleLengthSchemaFaker";
import {generateTrailerLength} from "../schemes/vehicle/trailerLength/trailerLengthSchemaFaker";
import mongoose from "mongoose";
import {reservationService} from "../schemes/reservation/reservationSchema";
import {getFakeReservation} from "../schemes/reservation/reservationSchemaFaker";
import {tripService} from "../schemes/trip/tripSchema";
import {getFakeTrip} from "../schemes/trip/tripSchemaFaker";
import {generateFakeRoute} from "../schemes/trip/route/routeSchemaFaker";
import {routeService} from "../schemes/trip/route/routeSchema";
import {trailerLengthService} from "../schemes/vehicle/trailerLength/trailerLengthSchema";
import {vehicleHeightService} from "../schemes/vehicle/vehicleHeight/vehicleHeightSchema";
import {vehicleLengthService} from "../schemes/vehicle/vehicleLength/vehicleLengthSchema";
import {faker} from "@faker-js/faker";
import {vehicleService} from "../schemes/vehicle/vehicleSchema";
import {generateFakeAccount, getFakeAccount} from "../schemes/account/accountSchemaFaker";
import {accountService} from "../schemes/account/accountSchema";

export const setupDB = async () => {
    const count = await mongoose.connection.db?.collection('trips')?.countDocuments() || 0
    if (count > 0) {
        return
    }

    await mongoose.connection.dropDatabase();

    const routes = await insertRoutes();

    const trailerLengthIDs = await insertTrailerLengths();
    const vehicleHeightIDs = await insertVehicleHeights();
    const vehicleLengthIDs = await insertVehicleLengths();

    const accounts = await insertAccounts(10)
    const customers = await insertCustomers(10, accounts.id);
    const ferries = await insertFerries(5);
    const vehicles = await insertVehicles(10, accounts.id, vehicleHeightIDs, vehicleLengthIDs, trailerLengthIDs);
    const trips = await insertTrips(routes, ferries, 10);
    await insertReservations(20, vehicles, customers.customer, trips);
}

const insertAccounts = async (count: number) => {
    const accounts = [await generateFakeAccount("root", "root")]
    for (let i = 1; i < count; i++) {
        accounts.push(await getFakeAccount())
    }
    const result = await accountService.insertMany(accounts)
    return {account: result, id: result.map(account => account._id)}
}

const insertCustomers = async (count: number, accountIDs: mongoose.Types.ObjectId[]) => {
    const customers = [];

    for (let i = 0; i < count; i++) {
        const accountID = accountIDs[i];
        customers.push(await generateCustomer(accountID));
    }

    const result = await customerService.insertMany(customers);
    return {customer: result, id: result.map(customer => customer._id)}
}

const insertFerries = async (count: number) => {
    const ferries = [];
    for (let i = 0; i < count; i++) {
        ferries.push(getFakeFerry());
    }
    return await ferryService.insertMany(ferries);
}


const insertVehicles = async (
    count: number,
    accountIDs: mongoose.Types.ObjectId[],
    vehicleHeightIDs: mongoose.Types.ObjectId[],
    vehicleLengthIDs: mongoose.Types.ObjectId[],
    trailerLengthIDs: mongoose.Types.ObjectId[]
) => {
    const vehicleHeights = await vehicleHeightService.find({_id: {$in: vehicleHeightIDs}});
    const vehicleLengths = await vehicleLengthService.find({_id: {$in: vehicleLengthIDs}});
    const trailerLengths = await trailerLengthService.find({_id: {$in: trailerLengthIDs}});

    const vehicles = [];

    for (let i = 0; i < count; i++) {
        const accountID = faker.helpers.arrayElement(accountIDs);
        const height = faker.helpers.arrayElement(vehicleHeights);
        const length = faker.helpers.arrayElement(vehicleLengths);
        const trailer = faker.helpers.arrayElement(trailerLengths);

        vehicles.push(getFakeVehicle(accountID, height, length, trailer));
    }

    return await vehicleService.insertMany(vehicles);
};


// const insertCustomer = async () => {
//     await customer.insertOne(await generateCustomer("test@example.com"))
//     const result = await customer.insertOne(await getFakeCustomer())
//     return result._id
// }

const insertTrips = async (
    routes: mongoose.Document[],
    ferries: mongoose.Document[],
    count: number
) => {
    const trips = [];
    for (let i = 0; i < count; i++) {
        const route = faker.helpers.arrayElement(routes);
        const ferry = faker.helpers.arrayElement(ferries);
        trips.push(getFakeTrip(route, ferry));
    }
    return await tripService.insertMany(trips);
}

const insertReservations = async (
    count: number,
    vehicles: mongoose.Document[],
    customers: mongoose.Document[],
    trips: mongoose.Document[]
) => {
    const reservations = [];
    for (let i = 0; i < count; i++) {
        const vehicle = faker.helpers.arrayElement(vehicles);
        const customer = faker.helpers.arrayElement(customers);
        const trip = faker.helpers.arrayElement(trips);
        reservations.push(getFakeReservation(vehicle, [customer], trip));
    }
    await reservationService.insertMany(reservations);
}

const insertRoutes = async () => {
    const routes = [
        generateFakeRoute('Hirtshals', 'Kristiansand', 'Experience the cold Baltic Sea'),
        generateFakeRoute('Kristiansand', 'Hirtshals', 'Experience the beauty of the Baltic Sea'),
        generateFakeRoute('Hirtshals', 'Lavrik', 'Direct route to the Norwegian city'),
        generateFakeRoute('Lavrik', 'Hirtshals', 'Gateway to Scandinavia'),
    ];
    return await routeService.insertMany(routes);
}

const insertTrailerLengths = async () => {
    const lengths = [
        generateTrailerLength("< 2m", 0, 2),
        generateTrailerLength("2m - 3m", 2, 3),
        generateTrailerLength("4m - 5m", 4, 5),
        generateTrailerLength("5m - 6m", 5, 6),
        generateTrailerLength("6m - 7m", 6, 7),
        generateTrailerLength("8m - 9m", 8, 9),
        generateTrailerLength("9m - 10m", 9, 10),
    ]
    const results = await trailerLengthService.insertMany(lengths)
    return results.map(doc => doc._id)
}

const insertVehicleHeights = async () => {
    const heights = [
        generateVehicleHeight("< 2m", 0, 2),
        generateVehicleHeight("2m - 2.6m", 2, 2.6),
        generateVehicleHeight("> 2.6m", 2.6, 3),
    ]

    const results = await vehicleHeightService.insertMany(heights)
    return results.map(doc => doc._id)
}

const insertVehicleLengths = async () => {
    const lengths = [
        generateVehicleLength("< 5m", 0, 5),
        generateVehicleLength("5m - 6m", 5, 6),
        generateVehicleLength("6m - 7m", 6, 7),
        generateVehicleLength("8m - 9m", 8, 9),
        generateVehicleLength("9m - 10m", 9, 10),
    ]

    const results = await vehicleLengthService.insertMany(lengths)
    return results.map(doc => doc._id)
}
