import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().integer().min(1).max(65535).default(3000),

  GLOBAL_PREFIX: Joi.string()
    .pattern(/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/)
    .required(),

  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql'] })
    .required(),

  AUTH0_DOMAIN: Joi.string()
    .pattern(/^[a-zA-Z0-9-]+\.us\.auth0\.com$/)
    .required(),

  AUTH0_ISSUER: Joi.string()
    .uri({ scheme: ['https'] })
    .pattern(/^https:\/\/.+\/$/)
    .required(),

  AUTH0_AUDIENCE: Joi.string()
    .uri({ scheme: ['https'] })
    .required(),

  SUPABASE_URL: Joi.string()
    .uri({ scheme: ['https'] })
    .required(),

  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),

  SUPABASE_BUCKET_NAME: Joi.string().required(),

  BREVO_API_KEY: Joi.string().required(),

  BREVO_SENDER_EMAIL: Joi.string().email().required(),

  BREVO_SENDER_NAME: Joi.string().required(),
});
