import * as Joi from 'joi';
import { UnfollowDto } from '../dtos';

export const UnfollowSchema = Joi.object<UnfollowDto>({
  unfollowerId: Joi.number().required(),
  unfolloweeId: Joi.number().required(),
});
