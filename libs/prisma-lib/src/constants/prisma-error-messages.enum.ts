import { PrismaErrorCodes } from '../enums';

export const PrismaErrorMessages: Record<PrismaErrorCodes, string> = {
  [PrismaErrorCodes.P2002]: 'The resource you are trying to create already exists. ',
};
