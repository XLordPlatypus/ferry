import Joi from "joi";

const accountValidator = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9!+\-_.]+(?:\.[a-zA-Z0-9!+\-_]+)*@(?:[a-zA-Z0-9\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\-]+\.)+[a-zA-Z0-9]{2,}$/)
        .not()
        .empty()
        .required(),
    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[A-Z])(?=.*[\x21-\x40\x5B\x5D-\x60\x7B\x7E])[\x21-\x5B\x5D-\x7E]{8,}$/)
        .required()
})

export default accountValidator