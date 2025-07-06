import * as mongoose from "mongoose";
import {setupDB} from "./dbSetup";

export async function connect() {
    const URL = process.env.DB_CONNECTION_STRING || `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017`
    await mongoose.connect(URL, {
        dbName: "ferryDB",
    })
        .then(async () => {
            console.log("Connected to DB")
            await setupDB()
        })
        .catch((error: Error) => {
            console.error("Connection failed! " + error)
        })
}