import * as Joi from 'joi';
import { FollowDto } from '../dtos';

export const FollowSchema = Joi.object<FollowDto>({
  followerId: Joi.number().required(),
  followeeId: Joi.number().required(),
});
