import {Session} from "./session";
import session from "express-session";
import express from "express";

export const sessions: Session[] = []

export const getSession = (sessionToken: string)=> {
    return sessions.find(e => e.sessionToken === sessionToken)
}

export const isSessionValid = (sessionToken: string, clientSession: session.Session) => {
    const session = sessions.find(e => e.sessionToken === sessionToken)
    if (!session) {
        return false
    }
    if (session.expiration >= new Date()) {
        return true
    } else {
        cancelSession(session)
        clientSession.destroy((e: Error) => console.log(e))
        return false
    }
}

export const cancelSession = (session: Session) => {
    const index = sessions.indexOf(session)
    sessions.splice(index, 1)
}

export const cancelSessionById = (sessionToken: string) => {
    const session = sessions.find(session => session.sessionToken === sessionToken)
    if (session) {
        cancelSession(session)
    }
}