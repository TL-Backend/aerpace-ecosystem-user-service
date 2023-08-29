exports.successResponses = {
  default: {
    statusCode: 200,
    message: '',
  },
  LOGIN_SUCCESSFUL: {
    message: 'login successful',
  },
  RESET_LINK_SENT: {
    message: 'Link to reset password is sent to your email',
  },
  TEMPORARY_PASSWORD_SET_SUCCESS: {
    message: 'Temporary password has been emailed to user for initial login.',
  },
  PASSWORD_CHANGED: {
    message: 'Password changed successfully',
  },
  TOKEN_REFRESHED: {
    message: 'access token refreshed successfully',
  },
};

exports.errorResponses = {
  default: {
    message: '',
  },
  healthCheckError: {
    message: 'Service unavailable',
  },
  EMAIL_INVALID: {
    message: 'Invalid email',
  },
  TOKEN_EXPIRED: {
    message: 'Token expired',
  },
  AUTHENTICATION_ERROR: {
    message: 'Email and password combination does not exists',
  },
  EMAIL_ALREADY_USED: {
    message: 'Email already used.',
  },
  SAME_PASSWORD_USED_ERROR: {
    message: 'New password cannot be same as the old one',
  },
  UUID_INVALID: {
    message: 'Invalid UUID',
  },
  INVALID_RESET_LINK: {
    message: 'Invalid Reset link',
  },
  PASSWORD_INVALID: {
    message: 'Invalid password',
  },
};
