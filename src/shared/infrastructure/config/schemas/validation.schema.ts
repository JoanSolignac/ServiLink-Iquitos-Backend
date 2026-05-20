import * as Joi from "joi";

export const validationSchema = Joi.object({
    NODE_ENV: Joi
        .string()
        .valid('development', 'test', 'production')
        .default('development'),

    PORT: Joi
        .number()
        .integer()
        .min(1)
        .max(65535)
        .default(3000),

    GLOBAL_PREFIX: Joi
        .string()
        .pattern(/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/)
        .required(),

    DATABASE_URL: Joi
        .string()
        .uri({ scheme: ['postgresql'] })
        .required(),
});