import * as Joi from 'joi';

export const AuthEnvSchemaValidation = Joi.object({
  AUTH_PORT: Joi.number().required().default(3000),
});
