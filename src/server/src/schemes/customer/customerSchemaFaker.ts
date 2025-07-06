import {fa, faker} from '@faker-js/faker';
import {customerService} from "./customerSchema";
import {Gender} from "../../constants/gender";
import {hashPassword} from "../../helper/hasher";
import mongoose from "mongoose";

export const getFakeCustomer = async () => {
    return new customerService({
        account: null,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        birthdate: faker.date.birthdate(),
        gender: faker.helpers.enumValue(Gender),
        email: faker.internet.email(),
        phone_number: faker.phone.number({style: "international"}),
        nationality: faker.location.country(),
        driver_license: {
            country_code: faker.location.countryCode(),
            license_number: faker.number.int({min: 100, max: 999}),
            date_of_issue: faker.date.anytime(),
        },
        address: {
            city: faker.location.city(),
            postal_code: faker.location.zipCode(),
            house_number: faker.location.buildingNumber(),
            house_number_addon: faker.location.secondaryAddress(),
            street: faker.location.street()
        },
    })
}

export const generateCustomer = async (account: mongoose.Types.ObjectId) => {
    return new customerService({
        account: account,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        birthdate: faker.date.birthdate(),
        gender: faker.helpers.enumValue(Gender),
        email: faker.internet.email(),
        phone_number: faker.phone.number({style: "international"}),
        nationality: faker.location.country(),
        driver_license: {
            country_code: faker.location.countryCode(),
            license_number: faker.number.int({min: 100, max: 999}),
            date_of_issue: faker.date.anytime(),
        },
        address: {
            city: faker.location.city(),
            postal_code: faker.location.zipCode(),
            house_number: faker.location.buildingNumber(),
            house_number_addon: faker.location.secondaryAddress(),
            street: faker.location.street()
        },
    })
}