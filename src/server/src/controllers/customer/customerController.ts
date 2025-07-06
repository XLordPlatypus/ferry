import express from "express";
import {customerService} from "../../schemes/customer/customerSchema";
import {newResponseMessage} from "../../helper/responseMessageProvider";
import customerValidator from "./customerValidator";
import {getSession} from "../../authentication/sessionStorage";
import {accountService} from "../../schemes/account/accountSchema";
import {hashPassword} from "../../helper/hasher";

const customerRouter = express.Router()

customerRouter.get('/', async (req, res) => {
    try {
        if (req.session.sessionToken) {
            const session = getSession(req.session.sessionToken)
            if (!session) {
                res.status(404).json(newResponseMessage(false, {}, 'No customer found'))
            } else {
                const customers = await customerService.findOne({account: session?.userID})

                if (customers) {
                    res.status(200).json(customers)
                } else {
                    res.status(404).json(newResponseMessage(false, {}, 'No customers found'))
                }
            }
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal Server Error'))
    }
})

customerRouter.put('/', async (req, res) => {
    try {
        const {error} = customerValidator.validate(req.body)
        if (error) {
            res.status(403).json(newResponseMessage(false, {error: error.toString()}, 'Input validation failed'))
        } else {
            if (req.session.sessionToken) {
                const session = getSession(req.session.sessionToken)
                if (!session) {
                    res.status(404).json(newResponseMessage(false, {}, 'No customer found'))
                } else {
                    await customerService.updateOne({account: session?.userID}, {
                        $set: {
                            address: req.body.address,
                            driver_license: req.body.driver_license,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            birthdate: req.body.birthdate,
                            gender: req.body.gender,
                            email: req.body.email,
                            phone_number: req.body.phone_number,
                            nationality: req.body.nationality,
                        }
                    })

                    if (req.body.password) {
                        const hash = hashPassword(req.body.password)
                        await accountService.updateOne({_id: req.body.account}, {
                            $set: {
                                password: hash
                            }
                        })
                    } else if (req.body.email) {
                        await accountService.updateOne({_id: req.body.account}, {
                            $set: {
                                email: req.body.email
                            }
                        })
                    }
                    res.status(200).json(newResponseMessage(true, {}, 'Customer successfully updated'))
                }
            }
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal Server Error'))
    }
})

customerRouter.post('/', async (req, res) => {
    try {
        const { error } = customerValidator.validate(req.body)
        if (error) {
            res.status(422).json(newResponseMessage(false, { error: error.toString()}, 'Input validation failed'))
        } else {
            if (req.session.sessionToken) {
                const newBody = req.body
                newBody.account = getSession(req.session.sessionToken)?.userID
                await customerService.insertOne(newBody)
                res.status(201).json(newResponseMessage(true, {}, 'Customer created successfully'))
            }
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal Server Error'))
    }
})

export default customerRouter