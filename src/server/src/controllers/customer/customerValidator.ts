import Joi from "joi";
import { Gender } from "../../constants/gender";

const customerValidator = Joi.object({
    password: Joi.string()
        .allow('')
        .optional(),
    firstname: Joi.string()
        .not()
        .empty()
        .required(),

    lastname: Joi.string()
        .not()
        .empty()
        .required(),

    birthdate: Joi.date()
        .required(),

    gender: Joi.string()
        .valid(...Object.values(Gender))
        .default(Gender.MALE),

    email: Joi.string()
        .pattern(/^[a-zA-Z0-9!+\-_.]+(?:\.[a-zA-Z0-9!+\-_]+)*@(?:[a-zA-Z0-9\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\-]+\.)+[a-zA-Z0-9]{2,}$/)
        .not()
        .empty()
        .required(),

    phone_number: Joi.string()
        .not()
        .empty()
        .required(),

    nationality: Joi.string()
        .not()
        .empty()
        .required(),

    driver_license: Joi.object({
        country_code: Joi.string().required(),
        license_number: Joi.string().required(),
        date_of_issue: Joi.date().required()
    }).required(),

    address: Joi.object({
        city: Joi.string()
            .not()
            .empty()
            .required(),

        postal_code: Joi.string()
            .not()
            .empty()
            .required(),

        house_number: Joi.string()
            .not()
            .empty()
            .required(),

        house_number_addon: Joi.string()
            .optional()
            .allow(null, ""),

        street: Joi.string()
            .not()
            .empty()
            .required()
    }).required()
});

export default customerValidator;