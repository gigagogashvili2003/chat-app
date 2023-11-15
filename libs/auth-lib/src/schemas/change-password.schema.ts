import * as Joi from 'joi';
import { ChangePasswordDto } from '../dtos';
export const ChangePasswordSchema = Joi.object<ChangePasswordDto>({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*\\W).{8,}$')).required().messages({
    'string.pattern.base':
      'Password must contain at least 1 digit, 1 uppercase letter, 1 symbol, and be at least 8 characters long',
  }),
});
