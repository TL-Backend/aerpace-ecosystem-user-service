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
    statusCode: 400,
    message: '',
  },
  healthCheckError: {
    statusCode: 503,
    message: 'Service unavailable',
  },
  EMAIL_INVALID: {
    statusCode: 400,
    message: 'Invalid email',
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    message: 'Token expired',
  },
  AUTHENTICATION_ERROR: {
    statusCode: 400,
    message: 'Email and password combination does not exists',
  },
  EMAIL_ALREADY_USED: {
    statusCode: 409,
    message: 'Email already used.',
  },
  SAME_PASSWORD_USED_ERROR: {
    statusCode: 409,
    message: 'New password cannot be same as the old one',
  },
  UUID_INVALID: {
    statusCode: 400,
    message: 'Invalid UUID',
  },
  INVALID_RESET_LINK: {
    statusCode: 400,
    message: 'Invalid Reset link',
  },
  PASSWORD_INVALID: {
    statusCode: 400,
    message: 'Invalid password',
  },
};
