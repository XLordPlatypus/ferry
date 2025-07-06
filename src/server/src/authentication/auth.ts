import express from "express";
import {isSessionValid} from "./sessionStorage";
import {newResponseMessage} from "../helper/responseMessageProvider";


export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.sessionToken) {
        res.status(401).json(newResponseMessage(false, {}, 'Unauthorized! Please login to continue'))
        return
    }
    if (isSessionValid(req.session.sessionToken, req.session)) {
        next()
        return
    }
    res.status(401).json(newResponseMessage(false, {}, 'Unauthorized! Please login to continue'))
}
