import * as Joi from 'joi';
import { CreateUserDto } from '../dtos/create-user.dto';
export const CreateUserSchema = Joi.object<CreateUserDto>({
  username: Joi.string().min(4).required(),
  password: Joi.string().pattern(new RegExp('^(?=.*\\d)(?=.*[A-Z])(?=.*\\W).{8,}$')).required().messages({
    'string.pattern.base':
      'Password must contain at least 1 digit, 1 uppercase letter, 1 symbol, and be at least 8 characters long',
  }),
  email: Joi.string().email().required(),
});
