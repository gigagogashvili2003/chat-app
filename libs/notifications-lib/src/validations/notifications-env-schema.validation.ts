import * as Joi from 'joi';

export const NotificationsEnvSchemaValidation = Joi.object({
  NOTIFICATIONS_PORT: Joi.number().required().default(3000),
});
