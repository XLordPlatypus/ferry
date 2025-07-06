import {ferryService} from "./ferrySchema";
import {faker} from "@faker-js/faker";
import mongoose from "mongoose";

export const getFakeFerry = () => {
    return new ferryService({
        name: faker.person.firstName(),
    })
}