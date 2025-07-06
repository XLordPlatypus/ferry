import express from "express";
import {customerService} from "../schemes/customer/customerSchema";
import {cancelSession, cancelSessionById, getSession, isSessionValid, sessions} from "../authentication/sessionStorage";
import {generateSession} from "../authentication/session";
import {newResponseMessage} from "../helper/responseMessageProvider";
import {checkHash, hashPassword} from "../helper/hasher";
import {accountService} from "../schemes/account/accountSchema";
import accountValidator from "./account/accountValidator";
import customerValidator from "./customer/customerValidator";

const authenticationRouter = express.Router()

authenticationRouter.post('/login', async (req, res) => {
    try {
        const user = await accountService.findOne({ email: req.body.email })
        if (!user) {
            res.status(404).json(newResponseMessage(false, {}, 'Email does not exist'))
        } else {
            if (checkHash(req.body.password, user.password)) {
                const session = generateSession(user._id)
                sessions.push(session)
                req.session.sessionToken = session.sessionToken
                res.status(200).json(newResponseMessage(true, {}, 'Login successful'))
            } else {
                res.status(401).json(newResponseMessage(false, {}, 'Invalid login credentials'))
            }
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal Server error'))
    }
});

authenticationRouter.post('/logout', (req, res) => {
    if (req.session.sessionToken) {
        cancelSessionById(req.session.sessionToken)
    }
    req.session.destroy((e: Error) => {
        if (e) {
            res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal server error'))
        } else {
            res.status(200).json(newResponseMessage(true, {}, 'Logout successful'))
        }
    })
})

authenticationRouter.post('/signup', async (req, res) => {
    const { error: accountError } = accountValidator.validate({ email: req.body.email, password: req.body.password })
    if (accountError) {
        res.status(422).json(newResponseMessage(false, {error: accountError }, 'Validation error'))
        return
    }
    const body = JSON.parse(JSON.stringify(req.body))
    delete body.password
    const { error: customerError } = customerValidator.validate(body)
    if (customerError) {
        res.status(422).json(newResponseMessage(false, {error: customerError }, 'Validation error'))
        return
    }
    try {
        const email = await accountService.findOne({email: req.body.email})
        if (email) {
            res.status(409).json(newResponseMessage(false, {}, 'Email is already in use!'))
        } else {
            const newAccount = {email: req.body.email, password: await hashPassword(req.body.password)}
            const accountID = await accountService.insertOne(newAccount)

            const session = generateSession(accountID._id)
            sessions.push(session)
            req.session.sessionToken = session.sessionToken

            const newCustomer = req.body
            newCustomer.account = session.userID
            delete newCustomer.password
            const result = await customerService.insertOne(newCustomer)

            res.status(201).json(newResponseMessage(true, {}, 'Account created!'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal server error'))
    }
})

authenticationRouter.get('/me', (req, res) => {
    try {
        if (!req.session.sessionToken) {
            res.status(401).json(newResponseMessage(false, {}, 'User not authenticated'))
        } else {
            if (isSessionValid(req.session.sessionToken, req.session)) {
                res.status(200).json(newResponseMessage(true, {}, 'User successfully authenticated'))
            } else {
                res.status(401).json(newResponseMessage(false, {}, 'Token outdated'))
            }
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal server error'))
    }
})

export default authenticationRouter