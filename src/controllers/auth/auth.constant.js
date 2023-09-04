exports.successResponses = {
  LOGIN_SUCCESSFUL: 'login successful',
  RESET_LINK_SENT: 'Link to reset password is sent to your email',
  TEMPORARY_PASSWORD_SET_SUCCESS:
    'Temporary password has been emailed to user for initial login.',
  PASSWORD_CHANGED: 'Password changed successfully',
  TOKEN_REFRESHED: 'access token refreshed successfully',
  DATA_FETCH_SUCCESSFULL: 'data fetched or processed successfully',
};

exports.errorResponses = {
  healthCheckError: 'Service unavailable',
  EMAIL_INVALID: 'Invalid email or user not found',
  TOKEN_INVALID: 'token invalid',
  INVALID_REFRESH_TOKEN: 'invalid refresh token',
  TOKEN_EXPIRED: 'Token expired',
  INVALID_SIGNATURE: 'invalid signature or invalid token',
  AUTHENTICATION_ERROR: 'Email and password combination does not exists',
  EMAIL_ALREADY_USED: 'Email already used.',
  SAME_PASSWORD_USED_ERROR: 'New password cannot be same as the old one',
  UUID_INVALID: 'Invalid UUID',
  USER_NOT_FOUND: 'user details not found',
  INVALID_RESET_LINK: 'Invalid Reset link',
  PASSWORD_INVALID: 'password invalid or empty',
};
