import express from "express";
import {accountService} from "../../schemes/account/accountSchema";
import {newResponseMessage} from "../../helper/responseMessageProvider";
import {hashPassword} from "../../helper/hasher";
import accountValidator from "./accountValidator";
import {cancelSession, getSession} from "../../authentication/sessionStorage";

const accountRouter = express.Router()

accountRouter.put('/:accountID', async (req, res) => {
    try {
        const { error } = accountValidator.validate(req.body)
        if (error) {
            res.status(403).json(newResponseMessage(false, error?.toString(), 'Email or password invalid'))
        } else {
            const session = getSession(req.session.sessionToken || '')
            if (req.params.accountID === session?.userID?.toString()) {
                const hash = await hashPassword(req.body.password)
                await accountService.updateOne({_id: req.params.accountID}, {
                    $set: {
                        email: req.body.email,
                        password: hash
                    }
                })
                res.status(200).json(newResponseMessage(true, {}, 'Account successfully updated'))
            } else {
                res.status(401).json(newResponseMessage(false, {}, 'Invalid Request'))
            }
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal Server Error'))
    }
})

accountRouter.delete('/:accountID', async (req, res) => {
    try {
        const session = getSession(req.session.sessionToken || '')
        if (req.params.accountID === session?.userID?.toString()) {
            req.session.destroy(() => {})
            cancelSession(session)
            await accountService.deleteOne({_id: req.params.accountID})
            res.status(200).json(newResponseMessage(true, {}, 'Account successfully deleted'))
        } else {
            res.status(401).json(newResponseMessage(false, {}, 'Invalid Request'))
        }
    } catch (e) {
        res.status(500).json(newResponseMessage(false, { error: e?.toString() }, 'Internal Server Error'))
    }
})

export default accountRouter