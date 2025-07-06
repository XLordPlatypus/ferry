import express from "express";
import {connect} from "./db/dbConnection";
import cors from 'cors'
import session from "express-session";
import {setupRoutes} from "./routes";
import nodemailer from "nodemailer";

// add custom properties to express-session
declare module 'express-session' {
    interface SessionData {
        sessionToken: string;
    }
}

// load .env file
require('dotenv').config({path: __dirname + '/../.env'})

// setup app and express-session
const port = 3000;
export const app = express();

setupAppSettings()
setupRoutes()
startApp()

export const emailTransporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    ignoreTLS: true,
});

function startApp() {
    app.listen(port, async () => {
        await connect()
        console.log(`Server is running on port: ${port}`);
    });
}

function setupAppSettings() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:5173',
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    }));

    app.use(session({
        secret: process.env.SECRET_KEY || '',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7200000,
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        }
    }));
}
