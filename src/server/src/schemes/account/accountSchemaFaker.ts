import {accountService} from "./accountSchema";
import {faker} from "@faker-js/faker";
import {hashPassword} from "../../helper/hasher";

export const getFakeAccount = async () => {
    const password = "root"
    const hash = await hashPassword(password)
    return new accountService({
        email: faker.internet.email(),
        password: hash,
    })
}

export const generateFakeAccount = async (email: string, password: string) => {
    const hash = await hashPassword(password)
    return new accountService({
        email: email,
        password: hash,
    })
}