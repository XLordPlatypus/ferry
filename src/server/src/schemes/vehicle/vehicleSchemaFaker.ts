import mongoose from "mongoose";
import {vehicleService} from "./vehicleSchema";
import {faker} from "@faker-js/faker";

export const getFakeVehicle = (
    account: mongoose.Types.ObjectId,
    vehicleHeight: mongoose.Document,
    vehicleLength: mongoose.Document,
    trailerLength: mongoose.Document,
) => {
    return new vehicleService({
        account: account,
        motorcycle: faker.datatype.boolean(),
        height: vehicleHeight,
        length: vehicleLength,
        trailer: {
            length: trailerLength,
            exists: faker.datatype.boolean(),
        }
    });
};
