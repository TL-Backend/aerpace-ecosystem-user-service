exports.successResponses = {
  LOGIN_SUCCESSFUL: 'Login successful',
  RESET_LINK_SENT: 'Link to reset password is sent to your email',
  TEMPORARY_PASSWORD_SET_SUCCESS: 'Temporary password is sent to your email',
  PASSWORD_CHANGED: 'Password changed successfully',
  TOKEN_REFRESHED: 'Access token refreshed successfully',
  DATA_FETCH_SUCCESSFUL: 'Data fetched successfully',
};

exports.errorResponses = {
  HEALTH_CHECK_ERROR: 'Service unavailable',
  EMAIL_INVALID: 'Email required',
  INVALID_EMAIL_USERTYPE_COMBINATION: 'Invalid credentials',
  TOKEN_INVALID: 'token required',
  INVALID_REFRESH_TOKEN: 'Something went wrong',
  TOKEN_EXPIRED: 'Something went wrong',
  INVALID_SIGNATURE: 'Something went wrong',
  AUTHENTICATION_ERROR: 'Invalid credentials',
  EMAIL_ALREADY_USED: 'Email already in use',
  SAME_PASSWORD_USED_ERROR: 'New password cannot be same as the old one',
  UUID_INVALID: 'Invalid UUID',
  USER_NOT_FOUND: 'User not found',
  INVALID_RESET_LINK: 'Something went wrong',
  INVALID_APP_TYPE: 'App type required',
  PASSWORD_INVALID: 'Password required',
  INTERNAL_ERROR: 'Something went wrong',
  NOT_FIRST_TIME_LOGIN: 'Something went wrong'
};

exports.appType = {
  ADMIN_PORTAL: 'ADMIN_PORTAL',
};

exports.userType = {
  USER: 'USER',
};

exports.tokenTypes = {
  ID_TOKEN: `ID_TOKEN`,
  REFRESH_TOKEN: `REFRESH_TOKEN`,
};
