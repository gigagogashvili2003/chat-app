import * as Joi from 'joi';

export const UsersEnvSchemaValidation = Joi.object({
  USERS_PORT: Joi.string().required().default(3001),
});
