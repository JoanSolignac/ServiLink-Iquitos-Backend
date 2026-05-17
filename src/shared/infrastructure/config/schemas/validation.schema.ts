import * as Joi from "joi";

export const validationSchema = Joi.object({
    NODE_ENV: Joi
        .string()
        .valid('development', 'test', 'production')
        .default('development'),
    
    PORT: Joi
        .number()
        .integer()
        .positive()
        .default(3000),

    GLOBAL_PREFIX: Joi
        .string()
        .pattern(/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/)
        .required(),
});