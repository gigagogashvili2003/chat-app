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

  //OTP
  INVALID_OTP = 'Invalid OTP. Please check your one-time password and try again',
  OTP_NOT_FOUND = 'OTP not found. Please initiate the verification process again.',
  INVALID_PASSWORD = 'Invalid old password. Please provide the correct old password.',
  SAME_PASSWORDS = 'The new password must be different from the current password.',

  //Followers
  INVALID_FOLLOWER = 'Invalid followerId',
  FOLLOWEE_NOT_FOUND = 'Followee not found!',
  FOLLOW_YOURSELF = "Cann't follow yourself!",
  UNFOLLOW_YOURSELF = "Cann't unfollow yourself!",
  ALREADY_FOLLOWING = "You're already following user ",
  INVALID_UNFOLLOWER = 'Invalid unfollowerId',
  UNFOLLOWEE_NOT_FOUND = 'Unfollowee not found!',
  NOT_FOLLOWING_USER = "You aren't following that user ",
}
