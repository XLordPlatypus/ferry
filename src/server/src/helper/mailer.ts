import nodemailer from 'nodemailer'
import { emailTransporter } from "../main";
import { Document } from "mongoose";
import mongoose from "mongoose";
import { reservationSchema } from "../schemes/reservation/reservationSchema";

export type Reservation = mongoose.InferSchemaType<typeof reservationSchema>;

export const sendMail = (reservation: Document & Reservation) => {
    (async () => {
        const customer = reservation?.customers?.[0];

        if (!customer?.email) {
            console.error("No customer email found for reservation", reservation._id);
            return;
        }

        const info = await emailTransporter.sendMail({
            from: `"APALA Ferry Services" <no-reply@apala-ferry.com>`,
            to: customer.email,
            subject: "Your Reservation at APALA Ferry",
            text: "",
            html: `<b>Dear ${customer.firstname}</b><br>
Your reservation is confirmed!<br>
Reservation nr. ${reservation._id}<br><br>
Greetings,<br>
APALA Ferry Team
`,
        });
    })();
};
