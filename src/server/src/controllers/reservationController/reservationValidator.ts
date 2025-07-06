import Joi from "joi";

export const reservationValidator = Joi.object({
    tripId: Joi.string().optional(),
    status: Joi.string().valid("CONFIRMED", "CANCELLED"),
    price: Joi.number(),
    vehicle: Joi.object().optional(),
    vehicle_details: Joi.object().optional(),
    terms_accepted: Joi.bool().truthy(),
    customers: Joi.array().items(Joi.object()).optional(),
    trip: Joi.object().optional(),
    timestamp: Joi.optional()
});
