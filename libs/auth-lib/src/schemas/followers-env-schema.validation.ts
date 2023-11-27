import * as Joi from 'joi';

export const FollowersSchemaValidation = Joi.object({
  FOLLOWERS_PORT: Joi.number().required().default(3003),
});
