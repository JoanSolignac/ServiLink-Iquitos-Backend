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

  AUTH0_MGMT_CLIENT_ID: Joi.string().required(),

  AUTH0_MGMT_CLIENT_SECRET: Joi.string().required(),

  SUPABASE_URL: Joi.string()
    .uri({ scheme: ['https'] })
    .required(),

  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),

  SUPABASE_BUCKET_NAME: Joi.string().required(),

  BREVO_API_KEY: Joi.string().required(),

  BREVO_SENDER_EMAIL: Joi.string().email().required(),

  BREVO_SENDER_NAME: Joi.string().required(),

  // Firebase Cloud Messaging (push notifications)
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),

  // Stripe Sandbox
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  STRIPE_PREMIUM_PRICE_ID: Joi.string().required(),
  // Optional fallback: resolve the active price dynamically from this product
  // when STRIPE_PREMIUM_PRICE_ID is unset or set to "price_placeholder".
  STRIPE_PREMIUM_PRODUCT_ID: Joi.string().optional(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  // Optional: dedicated return URL for the billing portal; defaults to STRIPE_SUCCESS_URL.
  STRIPE_PORTAL_RETURN_URL: Joi.string().optional(),
});
