import mongoose from "mongoose";

const sessionLength = 2

export type Session = {
    sessionToken: string,
    expiration: Date,
    userID: mongoose.Types.ObjectId,
}

export const generateSession = (userID: mongoose.Types.ObjectId): Session => {
    const date = new Date()
    date.setHours(date.getHours() + sessionLength)
    return {
        sessionToken: crypto.randomUUID(),
        expiration: date,
        userID: userID,
    }
}
