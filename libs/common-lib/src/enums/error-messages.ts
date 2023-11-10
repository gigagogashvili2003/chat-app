export enum ErrorMessages {
  USER_EMAIL_ALREADY_EXISTS = 'User with provided email already exists!',
  USER_USERNAME_ALREADY_EXISTS = 'User with provided username already exists!',
  USER_NOT_FOUND = 'User not found!',
  INCORRECT_PASSWORD = 'Incorrect password!',
  NOT_AUTHORIZED = 'You are unauthorized!',
  REFRESH_TOKEN_MISSING = 'Refresh token is missing from cookies!',
  DIRECT_ACCESS_NOT_ALLOWED = 'Direct access on services not allowed!',
  DEVICE_ID_MISSING = 'Device ID is required in the headers',
  SESSION_NOT_FOUND = 'Session not found for the given user and device.',
}
